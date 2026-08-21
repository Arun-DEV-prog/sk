// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { api } from "../lib/api";
import { WinCelebration } from "./shared";
import { PlayingCard } from "./teenpatti/FlipCard";
import CasinoChip from "./teenpatti/CasinoChip";
import DrinkStall from "./teenpatti/DrinkStall";
import CenterMultiplierWithCountdown from "./teenpatti/CenterMultiplierWithCountdown";
import { teenPattiAudio } from "./teenpatti/TeenPattiSoundEngine";
import { RulesModal, HistoryModal, RankingModal, SettingsModal } from "./teenpatti/TeenPattiModals";
import RoundResultPopup from "./teenpatti/RoundResultPopup";
import { emitGameWin } from "../components/TopGameWinnerBanner";
import { Wifi, Undo2, Music, HelpCircle, FileText, Users, Lock, Sparkles, Trophy, User as UserIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type HandKey = "A" | "B" | "C";
type Phase = "idle" | "betting" | "locked" | "revealing" | "payout" | "finished";

interface ServerTable {
  id?: number;
  table_no: string;   // "1" | "2" | "3"
  card_1: { suit: string; rank: string | number; value?: number } | null;
  card_2: { suit: string; rank: string | number; value?: number } | null;
  card_3: { suit: string; rank: string | number; value?: number } | null;
  hand_rank?: string | null;
  rank?: 1 | 2 | 3 | null;
  multiplier?: number;
  pot_total?: number;
  mine?: number;
  is_winner?: boolean;
}

interface GameStatePayload {
  round: { id: number; round_number: number; status: string; bet_ends_at?: string } | null;
  tables: ServerTable[];
  phase: Phase;
  countdown: number;
  onlinePlayers: number;
}

type FlyingChip = {
  id: number;
  target: HandKey;
  amount: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};

type Props = {
  balance?: number;
  onBalance?: (balance: number) => void;
  onBalanceChange?: (balance: number) => void;
  onClose?: () => void;
};

// ─── Suit & Rank Mapping ──────────────────────────────────────────────────────
const TABLE_KEY_MAP: Record<string, HandKey> = { "1": "A", "2": "B", "3": "C", A: "A", B: "B", C: "C" };
const HAND_KEY_TO_NO: Record<HandKey, string> = { A: "1", B: "2", C: "3" };
const SUIT_MAP: Record<string, "♠" | "♥" | "♦" | "♣"> = {
  S: "♠", H: "♥", D: "♦", C: "♣",
  "♠": "♠", "♥": "♥", "♦": "♦", "♣": "♣",
};
const RANK_LABELS: Record<string | number, string> = {
  1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10",
  11: "J", 12: "Q", 13: "K", 14: "A",
  "1": "A", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10",
  "11": "J", "12": "Q", "13": "K", "14": "A",
  J: "J", Q: "Q", K: "K", A: "A",
};

function serverCardToPlayingCard(c: any): PlayingCard | null {
  if (!c) return null;
  const rawRank = c.rank ?? c.value ?? "2";
  const rankStr = RANK_LABELS[rawRank] || String(rawRank);
  const suitKey = String(c.suit || "S").toUpperCase();
  const suitStr = SUIT_MAP[suitKey] || "♠";
  return { rank: rankStr, suit: suitStr };
}

function buildHandCards(table?: ServerTable, revealed = false): PlayingCard[] {
  if (!table) return [];
  const c1 = serverCardToPlayingCard(table.card_1);
  const c2 = revealed ? serverCardToPlayingCard(table.card_2) : null;
  const c3 = revealed ? serverCardToPlayingCard(table.card_3) : null;
  return [c1, c2, c3].filter(Boolean) as PlayingCard[];
}

const formatCompactBalance = (num: number): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return `${num}`;
};

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || "http://localhost:6001";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TeenPattiGame({
  balance: balanceProp,
  onBalance,
  onBalanceChange,
  onClose,
}: Props) {
  // ── Authenticated User State ──
  const [currentUser, setCurrentUser] = useState<any>(null);
  const loggedInUserImage =
    currentUser?.image ||
    currentUser?.photo ||
    currentUser?.profile_image ||
    currentUser?.profile_image_url ||
    currentUser?.avatar ||
    currentUser?.avatar_url ||
    currentUser?.profile?.avatar ||
    null;
  const loggedInUserName = currentUser?.name || currentUser?.username || "Player";

  // ── Balance State ──
  const [balance, setBalance] = useState<number>(balanceProp ?? 100000);
  const balanceRef = useRef<number>(balance);
  balanceRef.current = balance;

  const pushBalance = useCallback((bal: number) => {
    setBalance(bal);
    balanceRef.current = bal;
    onBalance?.(bal);
    onBalanceChange?.(bal);
  }, [onBalance, onBalanceChange]);

  // ── Server Game State ──
  const [phase, setPhase] = useState<Phase>("betting");
  const [countdown, setCountdown] = useState<number>(15);
  const [tables, setTables] = useState<ServerTable[]>([]);
  const tablesRef = useRef<ServerTable[]>([]);
  tablesRef.current = tables;

  const [roundId, setRoundId] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(101);
  const [onlinePlayers, setOnlinePlayers] = useState<number>(0);
  const [ping, setPing] = useState<number>(35);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [winnerNo, setWinnerNo] = useState<string | null>(null);

  // ── User Bet State ──
  const [heldChip, setHeldChip] = useState<number | null>(null);
  const [pendingBets, setPendingBets] = useState<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  const pendingBetsRef = useRef<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  pendingBetsRef.current = pendingBets;

  const [lastBets, setLastBets] = useState<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  const [autoBet, setAutoBet] = useState<boolean>(false);
  const [flyingChips, setFlyingChips] = useState<FlyingChip[]>([]);

  // ── Win / Loss Presentation ──
  const [win, setWin] = useState<{ amount: number; show: boolean }>({ amount: 0, show: false });
  const [floatingWinText, setFloatingWinText] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // ── Modals & Controls ──
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(false);
  const [openRules, setOpenRules] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openRanking, setOpenRanking] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  // ── Round Result Popup ──
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [resultPayload, setResultPayload] = useState<{ tables: any[]; winnerNo: string; payout: number } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ── Fetch Authenticated User & Balance from Real Database ──
  useEffect(() => {
    (async () => {
      // 1. Fetch user from /api/me
      try {
        const res: any = await api.get("/api/me");
        const u = res?.user || res?.data?.user || res?.data;
        if (u && u.id) {
          setCurrentUser(u);
          const b = typeof u.balance === "number" ? u.balance : (typeof u.diamonds === "number" ? u.diamonds : null);
          if (b !== null) {
            pushBalance(b);
            return;
          }
        }
      } catch {}

      // 2. Fallback to /api/games/teenpatti/balance
      try {
        const res2: any = await api.get("/api/games/teenpatti/balance");
        const b = res2?.data?.balance ?? res2?.balance ?? res2?.diamonds;
        if (typeof b === "number") pushBalance(b);
      } catch {}
    })();
  }, [pushBalance]);

  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);

  // ── Fetch Recent History & Real DB Leaderboard on Mount ──
  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/games/teenpatti/recent-history");
        if (res?.data && Array.isArray(res.data)) {
          setHistoryList(res.data);
        }
      } catch {}

      try {
        const res2: any = await api.get("/api/games/teenpatti/leaderboard");
        const list = res2?.data?.data || res2?.data;
        if (Array.isArray(list)) {
          setLeaderboardList(list);
        }
      } catch {}
    })();
  }, []);

  // ── Connect to Socket.io Server ───────────────────────────────────────────
  useEffect(() => {
    const token =
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("sk_love_token");

    const startPing = Date.now();
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionAttempts: 30,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setPing(Math.max(12, Date.now() - startPing));

      const rawUser = localStorage.getItem("sk_love_user");
      let storedUser = null;
      try { storedUser = rawUser ? JSON.parse(rawUser) : null; } catch {}

      socket.emit("auth", { token: token || "guest_token", user: storedUser || currentUser });
      socket.emit("game:request_state");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // ── Full Game State Update ──
    socket.on("game:state", (data: GameStatePayload) => {
      if (!data) return;
      applyGameState(data);
    });

    // ── Phase / Countdown Update ──
    socket.on("game:countdown", ({ phase: p, countdown: c }: { phase: Phase; countdown: number }) => {
      setPhase(p);
      setCountdown(c);
      if (p === "betting" && soundEnabled && c <= 3 && c >= 1) {
        teenPattiAudio.playWarningBeep(c);
      }
    });

    // ── Round Started ──
    socket.on("round_started", (data: any) => {
      setPhase("betting");
      setCountdown(data?.seconds_left || 15);
      setRevealed(false);
      setWinnerNo(null);
      setPendingBets({ A: 0, B: 0, C: 0 });
      pendingBetsRef.current = { A: 0, B: 0, C: 0 };
      setWin({ amount: 0, show: false });
      setFloatingWinText(null);
      if (data?.round_number) setRoundNumber(data.round_number);
      if (data?.round_id) setRoundId(data.round_id);
      if (data?.tables) setTables(data.tables);
      if (soundEnabled) teenPattiAudio.playDealCard();
    });

    // ── Bets Locked ──
    socket.on("bets_locked", () => {
      setPhase("locked");
      setCountdown(2);
    });

    // ── Cards Revealed ──
    socket.on("cards_revealed", (data: any) => {
      setPhase("revealing");
      setRevealed(true);
      if (data?.tables) setTables(data.tables);
      if (data?.winning_table_no) setWinnerNo(String(data.winning_table_no));
      if (soundEnabled) teenPattiAudio.playCardFlip();
    });

    // ── Individual Card Reveal Sequence ──
    socket.on("game:card_reveal", ({ tableNo, card1, card2, card3, handRank, rank }) => {
      // A reveal packet starts the card-by-card flip sequence in the table UI.
      setRevealed(true);
      setPhase("revealing");
      setTables((prev) =>
        prev.map((t) =>
          String(t.table_no) === String(tableNo)
            ? { ...t, card_1: card1 || t.card_1, card_2: card2, card_3: card3, hand_rank: handRank, rank: rank || t.rank }
            : t
        )
      );
      if (soundEnabled) teenPattiAudio.playCardFlip();
    });

    // ── Payout Results ──
    socket.on("game:payout", ({ tables: payoutTables, winningTable, multiplier }) => {
      const winTable = String(winningTable);
      setWinnerNo(winTable);
      setRevealed(true);
      setPhase("payout");
      if (payoutTables) setTables(payoutTables);
      handlePayout(winTable, Number(multiplier || 2.9));

      // Show result popup 1.5s after payout so cards animate first
      setTimeout(() => {
        const myBets = pendingBetsRef.current;
        const winKey = TABLE_KEY_MAP[winTable] || "A";
        const myBetOnWin = myBets[winKey] ?? 0;
        const myPayout = myBetOnWin > 0 ? Math.round(myBetOnWin * Number(multiplier || 2.9)) : 0;
        setResultPayload({
          tables: payoutTables || tablesRef.current,
          winnerNo: winTable,
          payout: myPayout,
        });
        setShowResultPopup(true);
      }, 1500);
    });

    // ── Live Player Count & Activity ──
    socket.on("game:online_players", ({ count }: { count: number }) => {
      setOnlinePlayers(count);
    });

    socket.on("game:bet_activity", (data: any) => {
      if (data?.tableNo && data?.pot_total) {
        setTables((prev) =>
          prev.map((t) => (String(t.table_no) === String(data.tableNo) ? { ...t, pot_total: data.pot_total } : t))
        );
      }
    });

    // ── Balance Sync ──
    socket.on("balance:update", (data: any) => {
      const newBal = data?.balance ?? data?.coins ?? data?.diamonds;
      if (typeof newBal === "number") pushBalance(newBal);
    });

    socket.on("bet_won", (data: any) => {
      if (data?.payout) {
        setWin({ amount: data.payout, show: true });
        setFloatingWinText(`+${data.payout.toLocaleString()}`);
        if (soundEnabled) teenPattiAudio.playWin();
        emitGameWin({ amount: data.payout, game: "Teen Patti" });
      }
      if (typeof data?.new_balance === "number") {
        pushBalance(data.new_balance);
      }
    });

    socket.on("bet:success", (data: any) => {
      const newBal = data?.data?.new_balance ?? data?.new_balance ?? data?.balance;
      if (typeof newBal === "number") pushBalance(newBal);
    });

    socket.on("bet:error", ({ message }: { message: string }) => {
      toast.error(message || "Bet failed");
    });

    socket.on("auth:success", ({ user }: any) => {
      if (user) {
        setCurrentUser(user);
        if (typeof user.balance === "number") pushBalance(Number(user.balance));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [soundEnabled, pushBalance]);

  // ─── Apply Game State Snapshot ───────────────────────────────────────────
  const prevPhaseRef = useRef<Phase>("idle");
  const applyGameState = useCallback(
    (data: GameStatePayload) => {
      const prevPhase = prevPhaseRef.current;
      const newPhase = data.phase || "betting";

      setPhase(newPhase);
      setCountdown(data.countdown ?? 0);
      setOnlinePlayers(data.onlinePlayers ?? 0);

      if (data.tables?.length) setTables(data.tables);
      if (data.round) {
        setRoundId(data.round.id);
        setRoundNumber(data.round.round_number);
      }

      if (prevPhase !== newPhase) {
        prevPhaseRef.current = newPhase;

        if (newPhase === "betting") {
          setRevealed(false);
          setWinnerNo(null);
          setPendingBets({ A: 0, B: 0, C: 0 });
          pendingBetsRef.current = { A: 0, B: 0, C: 0 };
          setWin({ amount: 0, show: false });
          setFloatingWinText(null);
          if (soundEnabled) teenPattiAudio.playDealCard();

          // Auto-Bet Logic
          if (autoBet && (lastBets.A > 0 || lastBets.B > 0 || lastBets.C > 0)) {
            const total = lastBets.A + lastBets.B + lastBets.C;
            if (balanceRef.current >= total) {
              setPendingBets({ ...lastBets });
              pendingBetsRef.current = { ...lastBets };
              pushBalance(balanceRef.current - total);
              (Object.keys(lastBets) as HandKey[]).forEach((k) => {
                if (lastBets[k] > 0) {
                  placeBetOnServer(k, lastBets[k]);
                }
              });
            }
          }
        }

        if (newPhase === "revealing" || newPhase === "payout") {
          setRevealed(true);
        }
      }
    },
    [autoBet, lastBets, soundEnabled, pushBalance]
  );

  // ─── Handle Round Payout ─────────────────────────────────────────────────
  const handlePayout = useCallback(
    (winTableNo: string, mult: number) => {
      const winKey = (TABLE_KEY_MAP[winTableNo] || "A") as HandKey;
      const myBets = pendingBetsRef.current;
      const myBetOnWinner = myBets[winKey] ?? 0;
      const payout = myBetOnWinner > 0 ? Math.round(myBetOnWinner * mult) : 0;
      const totalBet = myBets.A + myBets.B + myBets.C;

      if (totalBet > 0) setLastBets({ ...myBets });

      if (payout > 0) {
        setWin({ amount: payout, show: true });
        setFloatingWinText(`+${payout.toLocaleString()}`);
        if (soundEnabled) teenPattiAudio.playWin();
        emitGameWin({ amount: payout, game: "Teen Patti" });
        pushBalance(balanceRef.current + payout);
      } else if (totalBet > 0) {
        setFloatingWinText(`-${totalBet.toLocaleString()}`);
        if (soundEnabled) teenPattiAudio.playLose();
      }

      // Add to session history
      const winTable = tablesRef.current.find((t) => String(t.table_no) === String(winTableNo));
      setHistoryList((prev) => [
        {
          round: roundNumber,
          winner: winKey,
          handName: winTable?.hand_rank || "High Card",
          userWon: payout > 0,
          payout,
        },
        ...prev.slice(0, 19),
      ]);

      setTimeout(() => {
        setFloatingWinText(null);
        setWin({ amount: 0, show: false });
      }, 4000);
    },
    [roundNumber, soundEnabled, pushBalance]
  );

  // ─── Place Bet Helper ────────────────────────────────────────────────────
  const placeBetOnServer = (k: HandKey, amount: number) => {
    const tableNo = HAND_KEY_TO_NO[k];
    const tableObj = tablesRef.current.find((t) => String(t.table_no) === String(tableNo));
    const token =
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("sk_love_token");

    if (socketRef.current?.connected) {
      socketRef.current.emit("game:place_bet", {
        tableId: tableObj?.id,
        tableNo,
        amount,
        token,
      });
    } else {
      api
        .post("/api/games/teenpatti/bet", {
          round_id: roundId,
          table_no: tableNo,
          amount,
        })
        .catch(() => {});
    }
  };

  const placeBet = useCallback(
    (k: HandKey) => {
      if (phase !== "betting") {
        toast.error("Betting is closed for this round");
        return;
      }
      if (!heldChip) {
        toast.info("Pick up a coin first, then tap a card booth to bet");
        return;
      }
      if (balanceRef.current <= 0 || heldChip > balanceRef.current) {
        toast.error("পর্যাপ্ত কয়েন নেই!");
        return;
      }

      // Chip fly animation
      const chipId = Date.now() + Math.random();
      const positions: Record<HandKey, number> = { A: 0.22, B: 0.5, C: 0.78 };
      setFlyingChips((prev) => [
        ...prev,
        {
          id: chipId,
          target: k,
          amount: heldChip,
          startX: window.innerWidth * 0.5,
          startY: window.innerHeight - 70,
          targetX: window.innerWidth * positions[k],
          targetY: window.innerHeight * 0.62,
        },
      ]);
      setTimeout(() => {
        setFlyingChips((prev) => prev.filter((c) => c.id !== chipId));
      }, 720);

      // Optimistic UI balance & bet update
      setPendingBets((p) => {
        const next = { ...p, [k]: p[k] + heldChip };
        pendingBetsRef.current = next;
        return next;
      });

      pushBalance(balanceRef.current - heldChip);
      if (soundEnabled) teenPattiAudio.playChip();

      // Transmit bet
      placeBetOnServer(k, heldChip);
    },
    [phase, heldChip, soundEnabled, pushBalance]
  );

  // ─── Computed UI Metrics ─────────────────────────────────────────────────
  const totalUserBet = pendingBets.A + pendingBets.B + pendingBets.C;
  const totalPot =
    tables.reduce((sum, t) => sum + (t.pot_total || 0), 0) + totalUserBet;

  const getCards = (tableNo: string): PlayingCard[] => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    return buildHandCards(t, revealed);
  };

  const getPot = (tableNo: string): number => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    const key = (TABLE_KEY_MAP[tableNo] || "A") as HandKey;
    return (t?.pot_total ?? 15000) + (pendingBets[key] ?? 0);
  };

  const isWinner = (tableNo: string): boolean => {
    if (!winnerNo) return false;
    return String(winnerNo) === String(tableNo);
  };

  const getTableRank = (tableNo: string): 1 | 2 | 3 | null => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    if (t?.rank) return t.rank;
    if (isWinner(tableNo)) return 1;
    return null;
  };

  const getHandRankName = (tableNo: string): string | null => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    if (t?.hand_rank) return String(t.hand_rank).replace(/_/g, " ").toLowerCase();

    // Fall back to a clear, screenshot-style hand label when the server has
    // supplied cards but not yet calculated a display rank.
    const ranks = [t?.card_1, t?.card_2, t?.card_3]
      .filter(Boolean)
      .map((card: any) => String(card.rank ?? card.value ?? ""));
    if (ranks.length !== 3) return null;
    const counts = Object.values(ranks.reduce((all: Record<string, number>, rank: string) => {
      all[rank] = (all[rank] || 0) + 1;
      return all;
    }, {}));
    if (counts.includes(3)) return "three of a kind";
    if (counts.includes(2)) return "pair";
    return "high card";
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-col h-full w-full bg-[radial-gradient(ellipse_at_50%_42%,#2d7187_0%,#205b70_48%,#123f53_100%)] text-white overflow-hidden font-sans select-none">
      {/* 🪙 ANIMATED FLYING CHIPS */}
      {flyingChips.map((fc) => (
        <div
          key={fc.id}
          className="fixed pointer-events-none z-50 transition-all duration-400 ease-out"
          style={{
            top: fc.startY,
            left: fc.startX,
            transform: "translate(-50%, -50%)",
            "--chip-x": `${fc.targetX - fc.startX}px`,
            "--chip-y": `${fc.targetY - fc.startY}px`,
            animation: "flyToCard 680ms cubic-bezier(.12,.84,.2,1) forwards",
          }}
        >
          <CasinoChip value={fc.amount} size="sm" />
        </div>
      ))}

      {/* 1. TOP NAVIGATION & HEADER BAR */}
      <div className="relative z-30 flex items-start justify-between px-2 pt-1.5 pb-0 shrink-0">
        <div className="flex items-center gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1b4e64]/70 hover:bg-[#1b4e64] border border-[#7dd3fc]/40 text-slate-100 flex items-center justify-center shadow backdrop-blur-md active:scale-95 transition cursor-pointer"
              title="Back"
            >
              <Undo2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <button
            onClick={() => {
              setBgmEnabled((prev) => {
                teenPattiAudio.toggleBgm(!prev);
                return !prev;
              });
            }}
            className={`w-9 h-9 rounded-full border border-[#7dd3fc]/40 flex items-center justify-center shadow backdrop-blur-md active:scale-95 transition cursor-pointer ${
              bgmEnabled ? "bg-[#38bdf8] text-[#0f172a]" : "bg-[#1b4e64]/70 text-slate-100"
            }`}
            title="Music"
          >
            <Music className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setOpenRules(true)}
            className="w-9 h-9 rounded-full bg-[#1b4e64]/70 hover:bg-[#1b4e64] border border-[#7dd3fc]/40 text-slate-100 flex items-center justify-center shadow backdrop-blur-md active:scale-95 transition cursor-pointer"
            title="Rules"
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setOpenHistory(true)}
            className="w-9 h-9 rounded-full bg-[#1b4e64]/70 hover:bg-[#1b4e64] border border-[#7dd3fc]/40 text-slate-100 flex items-center justify-center shadow backdrop-blur-md active:scale-95 transition cursor-pointer"
            title="History"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Center/Right: User Badge, Online Players, Ping */}
        <div className="flex items-center gap-1.5 invisible">
          {false && currentUser && (
            <div className="flex items-center gap-1 bg-[#133e50]/80 border border-[#38bdf8]/40 rounded-full px-2 py-0.5 shadow backdrop-blur-md">
              <div className="w-4 h-4 rounded-full bg-cyan-600 border border-cyan-300 flex items-center justify-center text-[8px] font-black overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "👤"}</span>
                )}
              </div>
              <span className="text-[9px] font-black text-cyan-200 truncate max-w-[60px]">
                {currentUser.name || "Player"}
              </span>
            </div>
          )}

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setOpenRanking(true)}
                className="flex flex-col items-center justify-center bg-[#133e50]/80 hover:bg-[#133e50] border border-[#38bdf8]/40 rounded-xl px-2 py-0.5 text-slate-100 shadow backdrop-blur-md active:scale-95 transition cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-cyan-200" />
                <span className="text-[7px] font-black tracking-widest text-cyan-100 uppercase">
                  {onlinePlayers > 0 ? `${onlinePlayers}` : "TOP"}
                </span>
              </button>

              <div className="flex items-center gap-1 bg-[#133e50]/80 border border-[#38bdf8]/40 rounded-xl px-2 py-0.5 shadow backdrop-blur-md">
                <span className="text-[9px] font-black text-cyan-200 uppercase">
                  #{roundNumber || "..."}
                </span>
                <span className="text-xs leading-none">🍺</span>
              </div>
            </div>

            {/* Wi-Fi Ping Indicator */}
            <div
              className={`flex items-center gap-1 text-[10px] font-extrabold drop-shadow mr-0.5 ${
                connected ? "text-[#4ade80]" : "text-red-400"
              }`}
            >
              <Wifi className="w-3 h-3 stroke-[3]" />
              <span>{connected ? `${ping}ms` : "Offline"}</span>
            </div>
          </div>
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-1">
          <div className="flex h-7 w-8 items-center justify-center rounded-b-md bg-gradient-to-b from-[#ffec74] via-[#d99a20] to-[#8e4b09] border border-[#fff0aa] shadow-[0_1px_4px_rgba(0,0,0,.45)]">
            <Trophy className="h-4 w-4 fill-[#e6ae2e] text-[#7b3f08]" />
          </div>
          <div className="rounded bg-[#77929c]/75 border border-[#b4c7cd]/55 px-1 py-0.5 text-[8px] font-black text-[#e8f0f1]">NEW</div>
        </div>
      </div>

      {/* 2. CENTER SECTION: MULTIPLIER, STATUS RIBBON & COUNTDOWN */}
      <div className="relative min-h-0 flex-1 flex flex-col items-center justify-between px-2 sm:px-3 pt-1 pb-2">
        {/* Giant 3D Countdown Banner */}
        <div className="w-full flex justify-center mt-0.5">
          <CenterMultiplierWithCountdown
            seconds={countdown}
            showCountdown={phase === "betting"}
            totalPot={totalPot}
            userBet={totalUserBet}
            heldChip={heldChip}
          />
        </div>

        {/* 🌟 USER-FRIENDLY PHASE STATUS DOCKED RIBBON 🌟 */}
        <div className="w-full max-w-sm mx-auto my-1 flex justify-center z-20">
          {phase === "betting" ? (
            <div className="flex items-center gap-1.5 bg-[#0b4a34]/75 border border-[#419a78]/45 rounded-md px-5 py-0.5 shadow-lg [&>span]:hidden">
              <div className="text-[12px] font-semibold text-[#47cf82] tracking-wide">Game Start</div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black text-emerald-200 tracking-wider uppercase">
                🟢 Betting Open • Place Chips
              </span>
            </div>
          ) : phase === "locked" ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/90 via-yellow-900/90 to-amber-950/90 border border-yellow-400/60 rounded-full px-4 py-1 shadow-[0_0_15px_rgba(250,204,21,0.5)] backdrop-blur-md animate-in zoom-in-90 duration-200">
              <Lock className="w-3.5 h-3.5 text-yellow-300 stroke-[2.5]" />
              <span className="text-[11px] font-black text-yellow-200 tracking-wider uppercase">
                🔒 Bets Locked • No More Bets
              </span>
            </div>
          ) : phase === "revealing" ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950/90 via-indigo-900/90 to-purple-950/90 border border-purple-400/60 rounded-full px-4 py-1 shadow-[0_0_20px_rgba(192,132,252,0.6)] backdrop-blur-md animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-[11px] font-black text-purple-200 tracking-wider uppercase">
                🃏 Revealing Cards • 1st, 2nd, 3rd
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 rounded-full px-4 py-1 shadow-[0_0_25px_rgba(250,204,21,0.9)] backdrop-blur-md animate-pulse">
              <Trophy className="w-4 h-4 fill-amber-950 text-amber-950" />
              <span className="text-[11px] font-black text-amber-950 tracking-wider uppercase">
                👑 Table #{winnerNo || "1"} Wins • 2.9x Payout!
              </span>
            </div>
          )}
        </div>

        {/* 3. THREE DRINK STALLS & MULTI-TABLE CARDS WITH 1st, 2nd, 3rd PODIUM */}
        <div className="grid grid-cols-3 gap-2 items-end max-w-[332px] mx-auto w-full z-20">
          {(["1", "2", "3"] as const).map((no, idx) => {
            const key = (TABLE_KEY_MAP[no] || "A") as HandKey;
            const drinkTypes = ["orange", "cocktail", "beer"] as const;
            const isMiddle = key === "B";
            return (
              <div key={`${roundNumber}-${no}`} className={isMiddle ? "flex justify-center" : "flex justify-center"}>
                <DrinkStall
                  stallKey={key}
                  drinkType={drinkTypes[idx]}
                  cards={getCards(no)}
                  revealed={revealed}
                  pot={getPot(no)}
                  myBet={pendingBets[key]}
                  isWinner={isWinner(no)}
                  rank={getTableRank(no)}
                  handRank={getHandRankName(no)}
                  disabled={phase !== "betting"}
                  onClick={() => placeBet(key)}
                  isMiddle={isMiddle}
                />
              </div>
            );
          })}
        </div>

        <div className="relative z-20 mt-2 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-[#a8d8e8]/40 bg-[#0f3a4b]/80 px-2.5 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/80 bg-slate-200">
              {loggedInUserImage ? (
                <img src={loggedInUserImage} alt={loggedInUserName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-300 via-sky-500 to-blue-700 text-[10px] font-black text-white">
                  {loggedInUserName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan-200">User</span>
              <span className="text-[11px] font-black text-white">{loggedInUserName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM BAR: BALANCE, CHIPS & AUTO BET */}
      <div className="pointer-events-none absolute bottom-[48px] left-1/2 z-10 h-[110px] w-[140%] -translate-x-1/2 rounded-[50%] border-t-2 border-[#1a5870] bg-[#123f58]/45 shadow-[0_-12px_25px_rgba(5,25,43,.32)]" />
      <div className="relative z-30 bg-[#113c4d]/70 border-t border-[#8bb6c5]/30 px-1.5 sm:px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shrink-0 flex items-center justify-between gap-1 max-w-lg mx-auto w-full min-w-0">
        {/* Balance Capsule */}
        <div className="flex items-center gap-1 bg-[#09202c]/90 border border-yellow-400/40 rounded-full px-2 sm:px-3 py-1 shadow shrink-0">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-500 border border-yellow-100 flex items-center justify-center text-[10px] font-black text-amber-950 shadow">
            🪙
          </div>
          <span className="font-mono font-black text-xs md:text-sm text-white drop-shadow">
            {formatCompactBalance(balance)}
          </span>
        </div>

        {/* Casino Chips (100, 1K, 10K, 100K) */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2.5">
          {[100, 1000, 10000, 100000].map((val) => (
            <CasinoChip
              key={val}
              value={val}
              selected={heldChip === val}
              onClick={() => {
                setHeldChip((current) => current === val ? null : val);
                if (soundEnabled) teenPattiAudio.playChip();
              }}
              size="sm"
            />
          ))}
        </div>

        {/* 3D Auto Bet Button */}
        <button
          onClick={() => {
            const next = !autoBet;
            setAutoBet(next);
            toast[next ? "success" : "info"](
              next ? "Auto Bet Enabled" : "Auto Bet Disabled"
            );
          }}
          className={`flex items-center justify-center bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border border-cyan-200 rounded-xl px-3.5 py-1.5 text-xs font-black text-white shadow-[0_3px_8px_rgba(0,0,0,0.4)] cursor-pointer active:scale-95 transition shrink-0 ${
            autoBet ? "ring-2 ring-yellow-300 brightness-110" : "hover:brightness-105"
          }`}
        >
          <span>AGAIN</span>
        </button>
      </div>

      {/* WIN CELEBRATION MODAL */}
      <WinCelebration
        show={win.show}
        amount={win.amount}
        onClose={() => setWin({ amount: 0, show: false })}
      />

      {/* FLOATING WIN / LOSS TEXT */}
      {floatingWinText && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div
            className={`px-5 py-2 rounded-2xl font-black text-xl shadow-2xl border-2 ${
              floatingWinText.startsWith("+")
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-yellow-300 ring-4 ring-yellow-400/50"
                : "bg-gradient-to-r from-rose-600 to-red-700 text-white border-red-300 ring-4 ring-red-400/50"
            }`}
          >
            {floatingWinText}
          </div>
        </div>
      )}

      {/* ROUND RESULT POPUP — 1st, 2nd, 3rd real user winners & standings */}
      {resultPayload && (
        <RoundResultPopup
          show={showResultPopup}
          results={(() => {
            const stallMap = { "1": { key: "A", name: "Orange Stall", emoji: "🍊" }, "2": { key: "B", name: "Cocktail Stall", emoji: "🍹" }, "3": { key: "C", name: "Beer Stall", emoji: "🍺" } };
            return (resultPayload.tables || []).map((t) => {
              const info = stallMap[String(t.table_no)] || stallMap["1"];
              const key = info.key as "A" | "B" | "C";
              const myBet = pendingBetsRef.current[key] ?? 0;
              const isWin = String(t.table_no) === String(resultPayload.winnerNo);
              return {
                table_no: String(t.table_no),
                stallKey: key,
                stallName: info.name,
                drinkEmoji: info.emoji,
                hand_rank: t.hand_rank || "High Card",
                rank: (t.rank || (isWin ? 1 : 3)) as 1 | 2 | 3,
                pot_total: t.pot_total || 0,
                is_winner: isWin,
                myBet,
                myPayout: isWin ? resultPayload.payout : 0,
              };
            });
          })()}
          winningTable={resultPayload.winnerNo}
          roundNumber={roundNumber}
          myPayout={resultPayload.payout}
          topUsers={leaderboardList}
          onClose={() => setShowResultPopup(false)}
        />
      )}

      {/* MODALS */}
      <RulesModal open={openRules} onClose={() => setOpenRules(false)} />
      <HistoryModal open={openHistory} onClose={() => setOpenHistory(false)} history={historyList} />
      <RankingModal open={openRanking} onClose={() => setOpenRanking(false)} leaderboard={leaderboardList} />
      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    </div>
  );
}
