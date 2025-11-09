"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import type { Deck, SimulationResult } from "@/types";
import { lockDeck, simulateSession } from "@/lib/apiClient";

interface SimulationProps {
  playerDeck: Deck;
  availableCards: any[];
  onShowDetailedResults?: (sessionId: string) => void;
}

export default function Simulation({
  playerDeck,
  availableCards,
  onShowDetailedResults,
}: SimulationProps) {
  const { address } = useAccount();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    if (playerDeck.cards.length !== 5) {
      setError("Deck must have exactly 5 cards");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Получаем символы токенов из колоды
      const selectedTokens = playerDeck.cards.map((card) => card.symbol);

      // Блокируем колоду
      const lockedDeck = await lockDeck(address, selectedTokens);
      setSessionId(lockedDeck.session_id);

      // Запускаем симуляцию
      const simulationResult = await simulateSession(lockedDeck.session_id);
      setResult(simulationResult);

      // Сохраняем результат в localStorage для leaderboard
      if (address) {
        const existing = localStorage.getItem(`score_${address}`);
        const currentBest = existing ? parseFloat(existing) : 0;
        if (simulationResult.final_score > currentBest) {
          localStorage.setItem(
            `score_${address}`,
            simulationResult.final_score.toString()
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSimulate}
        disabled={loading || playerDeck.cards.length !== 5 || !address}
        className={`
          w-full py-3 px-6 rounded-lg font-medium text-base transition-all
          ${
            loading || playerDeck.cards.length !== 5 || !address
              ? "glass border border-white/8 text-white/40 cursor-not-allowed"
              : "glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white"
          }
        `}
      >
        {loading ? "Simulating..." : "Join Tournament & Simulate"}
      </button>

      {error && (
        <div className="glass border border-red-500/20 rounded-xl p-4 text-red-400/80">
          {error}
        </div>
      )}

      {sessionId && !result && (
        <div className="glass border border-blue-500/20 rounded-xl p-4 text-blue-400/80">
          Session ID: {sessionId}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="border rounded-xl p-6 text-center glass border-white/20">
            <div className="text-2xl font-medium mb-2 text-white" style={{ letterSpacing: '-0.02em' }}>
              Simulation Complete
            </div>
            <div className="text-xl mb-2 text-white/80">
              Final Score: <span className="text-white font-semibold">{result.final_score.toFixed(2)}</span>
            </div>
            <div className="text-sm text-white/60">
              Market Position: #{result.final_market_position}
            </div>
          </div>

          <div className="glass-1 border border-white/8 rounded-xl p-4">
            <h4 className="font-medium mb-3 text-white/90">Daily Scores</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.daily_scores.map((daily) => (
                <div
                  key={daily.day}
                  className="flex justify-between items-center text-sm text-white/60 border-b border-white/5 pb-2"
                >
                  <div>
                    <span className="text-white/80 font-medium">Day {daily.day}</span>
                    <span className="ml-2 text-white/40">Position: #{daily.market_position}</span>
                  </div>
                  <span className="text-white font-semibold">{daily.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {sessionId && (
            <div className="space-y-2">
              <div className="text-xs text-white/40 text-center">
                Session ID: {sessionId}
              </div>
              {onShowDetailedResults && (
                <button
                  onClick={() => onShowDetailedResults(sessionId)}
                  className="w-full py-2 px-4 rounded-lg glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white text-sm font-medium transition-all"
                >
                  Detailed Results
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

