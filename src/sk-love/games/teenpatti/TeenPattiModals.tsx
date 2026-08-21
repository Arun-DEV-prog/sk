// @ts-nocheck
import React, { useState, useEffect } from "react";
import { X, Trophy, BookOpen, Volume2, VolumeX, Shield, Award, Clock, Crown, Medal, RefreshCw, UserCheck } from "lucide-react";
import { api, getApiBaseUrl } from "../../lib/api";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function RulesModal({ open, onClose }: RulesModalProps) {
  if (!open) return null;

  const rankings = [
    { name: "Three of a Kind (Trio / Leopard)", payout: "2.9x", desc: "Three cards of the same rank (e.g., A♠ A♥ A♦, K-K-K)", example: "A♠ A♥ A♦" },
    { name: "Straight Flush (Pure Sequence)", payout: "2.9x", desc: "Three consecutive cards of the same suit", example: "K♣ Q♣ J♣" },
    { name: "Straight (Sequence / Run)", payout: "2.9x", desc: "Three consecutive cards of mixed suits", example: "10♦ 9♠ 8♥" },
    { name: "Flush (Color)", payout: "2.9x", desc: "Three cards of the same suit in any order", example: "K♥ 9♥ 4♥" },
    { name: "Pair (Double)", payout: "2.9x", desc: "Two cards of the same rank", example: "8♠ 8♣ 3♦" },
    { name: "High Card", payout: "2.9x", desc: "Highest single card determines the winner", example: "A♣ J♦ 4♠" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0c2e1b] via-[#091f13] to-[#04110a] border-2 border-yellow-400/60 rounded-3xl p-4 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-300" />
            <h3 className="text-base font-black text-yellow-300 uppercase tracking-wide">Teen Patti Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-yellow-200 flex items-center justify-center border border-yellow-400/40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-200">
            <p className="font-semibold text-white mb-1">🎮 How to Play & Win Coins:</p>
            <p>1. Choose your casino chip and place bets on <strong className="text-orange-400">Stall A</strong>, <strong className="text-rose-400">Stall B</strong>, or <strong className="text-amber-300">Stall C</strong>.</p>
            <p>2. When the 15-second timer ends, bets lock and cards flip.</p>
            <p>3. The highest Teen Patti hand ranking wins! Winning table pays <strong className="text-yellow-300">2.9x</strong> coins instantly credited to your real wallet balance.</p>
          </div>

          <h4 className="font-bold text-yellow-300 pt-1 text-[11px] uppercase tracking-wider">Hand Rankings Hierarchy:</h4>
          <div className="space-y-1.5">
            {rankings.map((r, idx) => (
              <div key={r.name} className="flex flex-col bg-black/40 p-2 rounded-lg border border-yellow-500/15">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white">#{idx + 1} {r.name}</span>
                  <span className="text-amber-300 font-mono">{r.payout}</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">{r.desc}</div>
                <div className="text-[10px] text-yellow-200 font-mono mt-0.5">{r.example}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-xs rounded-xl shadow-lg uppercase tracking-wider cursor-pointer"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  history?: Array<{ round: number; winner: "A" | "B" | "C"; handName: string; userWon: boolean; payout: number }>;
  leaderboard?: any[];
}

const resolveAvatarUrl = (entry: any): string | null => {
  const candidates = [
    entry?.avatar,
    entry?.avatar_url,
    entry?.avatarUrl,
    entry?.image,
    entry?.profile_image,
    entry?.profile_image_url,
    entry?.photo,
    entry?.photo_url,
    entry?.user?.avatar,
    entry?.user?.avatar_url,
    entry?.user?.image,
    entry?.user?.profile_image,
    entry?.user?.profile?.avatar,
    entry?.user?.profile_image_url,
    entry?.user?.photo,
    entry?.user?.profile?.photo,
  ];

  const value = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
  if (!value) return null;

  const s = value.trim();
  if (/^(https?:|data:)/i.test(s)) return s;
  if (s.startsWith("/")) return `${getApiBaseUrl()}${s}`;
  return s;
};

export function HistoryModal({ open, onClose, history = [], leaderboard = [] }: HistoryModalProps) {
  const [tab, setTab] = useState<"my_bets" | "global">("my_bets");
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [globalHistory, setGlobalHistory] = useState<any[]>(history);
  const [topPlayers, setTopPlayers] = useState<any[]>(leaderboard);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRealHistory = async () => {
    setLoading(true);
    try {
      // 1. Fetch user real bet history from DB
      const res1: any = await api.get("/api/games/teenpatti/bet-history");
      const list1 = res1?.data?.data || res1?.data || [];
      if (Array.isArray(list1)) setUserHistory(list1);

      // 2. Fetch global round history from DB
      const res2: any = await api.get("/api/games/teenpatti/recent-history");
      const list2 = res2?.data?.data || res2?.data || [];
      if (Array.isArray(list2)) setGlobalHistory(list2);

      const res3: any = await api.get("/game/leaderboard");
      const list3 = res3?.data?.data || res3?.data || res3?.leaderboard || [];
      if (Array.isArray(list3)) setTopPlayers(list3.slice(0, 3));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchRealHistory();
    }
  }, [open]);

  if (!open) return null;

  const winnerNames: Record<string, { name: string; color: string }> = {
    A: { name: "Orange (A)", color: "text-orange-300 bg-orange-950/60 border-orange-400/40" },
    B: { name: "Cocktail (B)", color: "text-rose-300 bg-rose-950/60 border-rose-400/40" },
    C: { name: "Beer (C)", color: "text-amber-300 bg-amber-950/60 border-amber-400/40" },
    "1": { name: "Orange (A)", color: "text-orange-300 bg-orange-950/60 border-orange-400/40" },
    "2": { name: "Cocktail (B)", color: "text-rose-300 bg-rose-950/60 border-rose-400/40" },
    "3": { name: "Beer (C)", color: "text-amber-300 bg-amber-950/60 border-amber-400/40" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0c2e1b] via-[#091f13] to-[#04110a] border-2 border-yellow-400/60 rounded-3xl p-4 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-300" />
            <h3 className="text-base font-black text-yellow-300 uppercase tracking-wide">Game Win & Bet History</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchRealHistory}
              disabled={loading}
              className="w-7 h-7 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-yellow-200 flex items-center justify-center border border-yellow-400/40 cursor-pointer active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-yellow-200 flex items-center justify-center border border-yellow-400/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[0, 1, 2].map((rank) => {
            const player = topPlayers[rank];
            const avatarUrl = resolveAvatarUrl(player);
            const name = player?.name || player?.username || player?.user_name || `Player ${rank + 1}`;
            const rankStyle = rank === 0
              ? "border-yellow-300/70 bg-yellow-950/40 text-yellow-200"
              : rank === 1
              ? "border-slate-300/60 bg-slate-900/50 text-slate-200"
              : "border-amber-600/60 bg-amber-950/40 text-amber-200";

            return (
              <div key={rank} className={`flex flex-col items-center rounded-xl border p-1.5 text-center ${rankStyle}`}>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-200/70 bg-cyan-800 flex items-center justify-center text-[10px] font-black">
                  {avatarUrl ? <img src={avatarUrl} alt={`${rank + 1} place avatar`} className="w-full h-full object-cover" /> : name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 right-0 rounded-full bg-black/80 px-1 text-[8px] font-black text-white">{rank + 1}</span>
                </div>
                <span className="mt-1 w-full truncate text-[9px] font-black">{name}</span>
                <span className="text-[8px] font-mono text-amber-300">{player?.coins ?? player?.total_won ?? "-"}</span>
              </div>
            );
          })}
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-yellow-500/20 mb-3 text-xs font-bold">
          <button
            onClick={() => setTab("my_bets")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "my_bets"
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            My Bets & Wins
          </button>
          <button
            onClick={() => setTab("global")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "global"
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Global Rounds
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1 text-xs">
          {tab === "my_bets" ? (
            userHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No bets recorded for your account yet.
              </div>
            ) : (
              userHistory.map((item, idx) => {
                const isWin = item.result === "win" || (item.payout && item.payout > 0);
                const isPending = item.result === "pending";
                const tableCfg = winnerNames[item.table_no] || winnerNames["1"];
                const roundNo = item.round?.round_number || item.round_id || `#${idx + 1}`;
                const displayName = item.user_name || item.name || item.username || "User Test";

                const avatarUrl = resolveAvatarUrl(item);

                return (
                  <div
                    key={item.id || idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      isWin
                        ? "bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30"
                        : isPending
                        ? "bg-yellow-950/30 border-yellow-500/30"
                        : "bg-black/40 border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-300/80 overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-900 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="user avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-black text-white">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 shadow-sm max-w-full">
                          <span className="text-[10px] text-emerald-200 font-bold truncate">{displayName}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-slate-400 font-bold text-[10px]">#{roundNo}</span>
                          <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold ${tableCfg.color}`}>
                            {tableCfg.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">
                        Bet: <span className="font-mono text-white">🪙 {Number(item.amount || 0).toLocaleString()}</span>
                      </div>
                      {isWin ? (
                        <span className="text-emerald-400 font-mono font-black text-xs">
                          +{Number(item.payout || item.amount * 2.9).toLocaleString()} 🪙
                        </span>
                      ) : isPending ? (
                        <span className="text-yellow-400 font-mono font-bold text-[10px]">PENDING</span>
                      ) : (
                        <span className="text-rose-400 font-mono text-[10px]">LOSE</span>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            globalHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No round history available.
              </div>
            ) : (
              globalHistory.map((h, i) => {
                const winKey = h.winning_table_no || h.winner || "1";
                const winCfg = winnerNames[winKey] || winnerNames["1"];
                const roundNum = h.round_number || h.round || (i + 1);
                const displayName = h.user_name || h.name || h.username || "User Test";

                const avatarUrl = resolveAvatarUrl(h);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-yellow-500/15"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-300/80 overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-900 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="winner avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-black text-white">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 shadow-sm max-w-full">
                          <span className="text-[10px] text-emerald-200 font-bold truncate">{displayName}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-slate-400 font-bold text-[10px]">#{roundNum}</span>
                          <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold ${winCfg.color}`}>
                            {winCfg.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-cyan-200 font-semibold uppercase">{h.handName || h.hand_rank || "2.9x Winner"}</div>
                      <span className="text-amber-300 font-mono font-bold text-[10px]">2.9x Payout</span>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
}

interface RankingModalProps {
  open: boolean;
  onClose: () => void;
  leaderboard?: Array<{ rank: number; name: string; coins: string | number; avatar?: string }>;
}

export function RankingModal({ open, onClose, leaderboard }: RankingModalProps) {
  const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>(leaderboard || []);

  useEffect(() => {
    if (open && (!leaderboard || leaderboard.length === 0)) {
      api.get("/api/games/teenpatti/leaderboard").then((res: any) => {
        const list = res?.data?.data || res?.data;
        if (Array.isArray(list) && list.length > 0) {
          setLiveLeaderboard(
            list.map((u: any, idx: number) => ({
              rank: idx + 1,
              name: u.name || `Player_${u.id}`,
              coins: typeof u.total_won === "number" ? u.total_won.toLocaleString() : (u.coins || "100K"),
              avatar: ["👑", "👸", "🃏", "💎", "⭐", "♠"][idx] || "⭐",
            }))
          );
        }
      }).catch(() => {});
    }
  }, [open, leaderboard]);

  if (!open) return null;

  const defaultTop = [
    { rank: 1, name: "King_Dragon99", coins: "1.45B", avatar: "👑" },
    { rank: 2, name: "Lucky_Queen", coins: "980M", avatar: "👸" },
    { rank: 3, name: "Pro_Patti_Boss", coins: "640M", avatar: "🃏" },
    { rank: 4, name: "DiamondHunter", coins: "410M", avatar: "💎" },
    { rank: 5, name: "GoldenStar", coins: "280M", avatar: "⭐" },
    { rank: 6, name: "RoyalFlush_Pro", coins: "195M", avatar: "♠" },
  ];

  const topPlayers = liveLeaderboard && liveLeaderboard.length > 0 ? liveLeaderboard : defaultTop;
  const p1 = topPlayers[0] || defaultTop[0];
  const p2 = topPlayers[1] || defaultTop[1];
  const p3 = topPlayers[2] || defaultTop[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0c2e1b] via-[#091f13] to-[#04110a] border-2 border-yellow-400/60 rounded-3xl p-4 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <h3 className="text-base font-black text-yellow-300 uppercase tracking-wide">Top Coin Winners</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-yellow-200 flex items-center justify-center border border-yellow-400/40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1st, 2nd, 3rd Podium Hero Cards */}
        <div className="grid grid-cols-3 gap-1.5 items-end mb-3 pt-2">
          {/* 2nd Place (Silver) */}
          <div className="flex flex-col items-center p-2 rounded-2xl bg-gradient-to-b from-slate-700/60 to-slate-900/80 border border-slate-300/60 shadow text-center">
            <div className="relative">
              <span className="text-2xl">{p2.avatar || "🥈"}</span>
              <span className="absolute -top-1 -right-1 bg-slate-200 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </div>
            <span className="text-[10px] font-bold text-slate-200 truncate max-w-full mt-1">{p2.name}</span>
            <span className="text-[10px] font-mono font-black text-amber-300">{p2.coins}</span>
          </div>

          {/* 1st Place (Gold Winner Crown) */}
          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-gradient-to-b from-amber-500/40 to-yellow-600/30 border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)] text-center scale-105 z-10">
            <div className="relative">
              <Crown className="w-5 h-5 fill-amber-300 text-amber-400 -mb-1 animate-bounce" />
              <span className="text-3xl">{p1.avatar || "👑"}</span>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-amber-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">1</span>
            </div>
            <span className="text-[11px] font-black text-yellow-200 truncate max-w-full mt-1">{p1.name}</span>
            <span className="text-xs font-mono font-black text-yellow-300">🪙 {p1.coins}</span>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="flex flex-col items-center p-2 rounded-2xl bg-gradient-to-b from-amber-900/60 to-amber-950/80 border border-amber-600/60 shadow text-center">
            <div className="relative">
              <span className="text-2xl">{p3.avatar || "🥉"}</span>
              <span className="absolute -top-1 -right-1 bg-amber-600 text-amber-100 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </div>
            <span className="text-[10px] font-bold text-amber-200 truncate max-w-full mt-1">{p3.name}</span>
            <span className="text-[10px] font-mono font-black text-amber-300">{p3.coins}</span>
          </div>
        </div>

        {/* Players List #4 and above */}
        <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1 text-xs">
          {topPlayers.slice(3).map((p, idx) => (
            <div
              key={idx + 4}
              className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-slate-400 w-5 text-center">#{idx + 4}</span>
                <span className="text-base">{p.avatar || "⭐"}</span>
                <span className="font-bold text-xs text-white truncate max-w-[120px]">{p.name}</span>
              </div>
              <div className="font-mono font-bold text-xs text-amber-300 flex items-center gap-1">
                <span>🪙</span>
                <span>{p.coins}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function SettingsModal({ open, onClose, soundEnabled, onToggleSound }: SettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0c2e1b] via-[#091f13] to-[#04110a] border-2 border-yellow-400/60 rounded-3xl p-4 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2 mb-3">
          <h3 className="text-base font-black text-yellow-300 uppercase tracking-wide">Game Settings</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-yellow-200 flex items-center justify-center border border-yellow-400/40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-yellow-500/20">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <div>
                <div className="font-bold text-sm text-white">Sound Effects</div>
                <div className="text-[10px] text-slate-400">Card flips, chip clacks & victory fanfares</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow ${
                  soundEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
