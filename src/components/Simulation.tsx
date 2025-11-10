"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import type { Deck, SimulateSessionResponse } from "@/types";
import { lockDeck, simulateSession } from "@/lib/apiClient";

interface SimulationProps {
  playerDeck: Deck;
}

export default function Simulation({
  playerDeck,
}: SimulationProps) {
  const { address } = useAccount();
  const router = useRouter();
  const [result, setResult] = useState<SimulateSessionResponse | null>(null);
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
      const simulationResponse = await simulateSession(lockedDeck.session_id, selectedTokens, address);
      setResult(simulationResponse);
      setSessionId(simulationResponse.session.session_id);

      // Сохраняем результат в localStorage для leaderboard
      if (address) {
        const existing = localStorage.getItem(`score_${address}`);
        const currentBest = existing ? parseFloat(existing) : 0;
        if (simulationResponse.simulation.final_score > currentBest) {
          localStorage.setItem(
            `score_${address}`,
            simulationResponse.simulation.final_score.toString()
          );
        }
      }

      // Перенаправляем на страницу результатов
      router.push(`/simulate?sessionId=${simulationResponse.session.session_id}`);
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
    </div>
  );
}

