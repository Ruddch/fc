"use client";

import { useEffect, useState } from "react";
import WalletConnect from "@/components/WalletConnect";

interface LeaderboardEntry {
  address: string;
  score: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Load all scores from localStorage
    const scores: LeaderboardEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("score_")) {
        const address = key.replace("score_", "");
        const score = parseInt(localStorage.getItem(key) || "0");
        scores.push({ address, score });
      }
    }
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    setEntries(scores);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen city-pop-bg relative z-10">
      <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
            Leaderboard
          </h2>
          <WalletConnect />
        </div>

        <div className="glass-1 p-6 rounded-xl">
          {entries.length === 0 ? (
            <div className="text-center text-white/40 py-8 font-normal text-sm">
              No scores yet. Play a game to appear on the leaderboard!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Rank</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Wallet</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.address}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-white/80">
                          #{index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-white/60">
                        {formatAddress(entry.address)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-white">
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

