// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Crown, Medal, Award, X, Sparkles, Trophy, User as UserIcon } from "lucide-react";
import { api } from "../../lib/api";

interface TopUser {
  rank: number;
  user_id?: number;
  name: string;
  avatar?: string;
  coins: number | string;
  total_won?: number;
}

interface TableResult {
  table_no: string;
  stallKey: "A" | "B" | "C";
  stallName: string;
  drinkEmoji: string;
  hand_rank: string;
  rank: 1 | 2 | 3;
  pot_total: number;
  is_winner: boolean;
  myBet?: number;
  myPayout?: number;
}

interface Props {
  show: boolean;
  results: TableResult[];
  winningTable: string | null;
  roundNumber: number;
  myPayout?: number;
  topUsers?: TopUser[];
  onClose: () => void;
}

const RANK_COLORS = {
  1: {
    card: "bg-gradient-to-b from-amber-400/25 to-amber-950/40 border-yellow-300/80 shadow-[0_0_15px_rgba(250,204,21,0.4)]",
    badge: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950",
    glow: "ring-2 ring-yellow-400/60",
    icon: Crown,
    label: "1st Winner",
    labelColor: "text-yellow-200",
    emoji: "👑",
  },
  2: {
    card: "bg-gradient-to-b from-slate-400/15 to-slate-900/40 border-slate-300/60",
    badge: "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900",
    glow: "ring-1 ring-slate-300/40",
    icon: Medal,
    label: "2nd Place",
    labelColor: "text-slate-200",
    emoji: "🥈",
  },
  3: {
    card: "bg-gradient-to-b from-amber-800/15 to-amber-950/40 border-amber-600/50",
    badge: "bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100",
    glow: "ring-1 ring-amber-600/30",
    icon: Award,
    label: "3rd Place",
    labelColor: "text-amber-300",
    emoji: "🥉",
  },
};

function formatCoins(n: any): string {
  const num = typeof n === "number" ? n : Number(n) || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return `${num.toLocaleString()}`;
}

export default function RoundResultPopup({
  show,
  results = [],
  winningTable,
  roundNumber,
  myPayout = 0,
  topUsers = [],
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [liveTopUsers, setLiveTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;
    if (topUsers && topUsers.length > 0) {
      setLiveTopUsers(topUsers.slice(0, 3));
      return;
    }

    let cancelled = false;

    const normalizeLeaderboard = (payload: any): TopUser[] => {
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.leaderboard)
            ? payload.leaderboard
            : Array.isArray(payload?.data?.data)
              ? payload.data.data
              : Array.isArray(payload?.result)
                ? payload.result
                : [];

      return rawList
        .map((entry: any, index: number) => {
          const rank = Number(entry?.rank ?? entry?.position ?? entry?.place ?? index + 1) || index + 1;
          const name = entry?.name || entry?.username || entry?.user_name || entry?.full_name || `Player ${rank}`;
          const avatar = entry?.avatar || entry?.image || entry?.profile_image || entry?.photo || entry?.profile?.avatar || "";
          const coins = entry?.coins ?? entry?.points ?? entry?.total_won ?? entry?.amount ?? entry?.balance ?? 0;
          return { rank, name, avatar, coins };
        })
        .slice(0, 3);
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/game/leaderboard");
        const list = normalizeLeaderboard(res);
        if (!cancelled && list.length) setLiveTopUsers(list);
      } catch {
        try {
          const res = await api.get("/api/games/teenpatti/leaderboard");
          const list = normalizeLeaderboard(res);
          if (!cancelled && list.length) setLiveTopUsers(list);
        } catch {
          if (!cancelled) setLiveTopUsers([]);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [show, topUsers]);

  if (!visible) return null;

  const defaultUsers: TopUser[] = [
    { rank: 1, name: "Test (VIP 1)", coins: 100000, avatar: "👑" },
    { rank: 2, name: "Player #2", coins: 85000, avatar: "🥈" },
    { rank: 3, name: "Player #3", coins: 50000, avatar: "🥉" },
  ];

  const players = liveTopUsers.length > 0 ? liveTopUsers : topUsers.length > 0 ? topUsers : defaultUsers;
  const u1 = players[0] || defaultUsers[0];
  const u2 = players[1] || defaultUsers[1];
  const u3 = players[2] || defaultUsers[2];

  const sortedTables = [...results].sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const winTable = sortedTables.find((t) => t.is_winner) || sortedTables[0];

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-3 transition-all duration-200 select-none ${
        animateIn ? "bg-black/60 backdrop-blur-[2px]" : "bg-black/0"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-[310px] transition-all duration-200 ease-out ${
          animateIn ? "scale-100 opacity-100 translate-y-0" : "scale-85 opacity-0 translate-y-4"
        }`}
      >
        {/* ─── Compact Popup Card ─── */}
        <div className="relative bg-gradient-to-b from-[#0c2435] via-[#091d2c] to-[#04111a] border border-yellow-400/60 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative px-3 pt-2 pb-1.5 text-center border-b border-yellow-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400/40" />
              <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider">
                Round #{roundNumber} Top Winners
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── 1st, 2nd, 3rd Real User Podium (From DB) ── */}
          <div className="px-2.5 pt-2 pb-1.5">
            <div className="text-[9px] font-black text-slate-300 text-center uppercase tracking-widest mb-1.5">
              🏆 Top Player Leaderboard 🏆
            </div>

            <div className="grid grid-cols-3 gap-1.5 items-end mb-2.5">
              {/* 2nd Place User */}
              <UserPodiumCard user={u2} cfg={RANK_COLORS[2]} podiumHeight="h-10" />

              {/* 1st Place User (Center Tall) */}
              <UserPodiumCard user={u1} cfg={RANK_COLORS[1]} podiumHeight="h-14" isWinner />

              {/* 3rd Place User */}
              <UserPodiumCard user={u3} cfg={RANK_COLORS[3]} podiumHeight="h-8" />
            </div>

            {/* ── Winning Table Summary ── */}
            {winTable && (
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-yellow-950/80 to-amber-950/80 border border-yellow-400/50 shadow-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{winTable.drinkEmoji}</span>
                  <div>
                    <div className="text-[10px] font-black text-white leading-tight">
                      {winTable.stallName} (1st Winner)
                    </div>
                    <div className="text-[9px] text-cyan-300 font-bold uppercase">
                      {winTable.hand_rank || "2.9x Winner"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-yellow-300 font-black">2.9x Payout</div>
                  <div className="text-[8px] text-slate-400 font-mono">
                    Pot: {formatCoins(winTable.pot_total)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── User Win Banner ── */}
          {myPayout > 0 && (
            <div className="mx-2.5 mb-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-emerald-900/90 border border-emerald-400/50 flex items-center justify-between shadow">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: "3s" }} />
                <span className="text-[10px] font-bold text-emerald-200">You Won!</span>
              </div>
              <span className="font-black text-emerald-300 text-xs font-mono">
                🪙 +{formatCoins(myPayout)}
              </span>
            </div>
          )}

          {/* Close Action */}
          <div className="px-2.5 pb-2.5 pt-0.5">
            <button
              onClick={onClose}
              className="w-full py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-xs rounded-lg shadow uppercase tracking-wider cursor-pointer active:scale-95 transition"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserPodiumCard({
  user,
  cfg,
  podiumHeight,
  isWinner = false,
}: {
  user: TopUser;
  cfg: typeof RANK_COLORS[1];
  podiumHeight: string;
  isWinner?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative flex flex-col items-center">
        {isWinner && (
          <Crown className="w-3.5 h-3.5 fill-yellow-300 text-yellow-400 animate-bounce -mb-0.5" />
        )}
        <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border border-cyan-300/60 flex items-center justify-center text-xs overflow-hidden shadow">
          {user.avatar && user.avatar.startsWith("http") ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : "👤")}</span>
          )}
        </div>
        <div className={`text-[8px] font-black px-1.5 py-0.2 rounded-full mt-0.5 ${cfg.badge}`}>
          {cfg.label}
        </div>
      </div>

      <div className="text-[9px] font-bold text-white text-center truncate w-full px-0.5 mt-0.5">
        {user.name || `User #${user.user_id || 1}`}
      </div>

      <div className="text-[8px] text-amber-300 font-mono font-black text-center truncate w-full">
        🪙 {formatCoins(user.coins ?? user.total_won ?? 0)}
      </div>

      <div
        className={`w-full rounded-t-md flex items-center justify-center ${podiumHeight} ${
          isWinner
            ? "bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            : user.rank === 2
            ? "bg-gradient-to-b from-slate-300 to-slate-500"
            : "bg-gradient-to-b from-amber-700 to-amber-900"
        }`}
      >
        <span className="font-black text-lg text-white drop-shadow">
          {user.rank}
        </span>
      </div>
    </div>
  );
}
