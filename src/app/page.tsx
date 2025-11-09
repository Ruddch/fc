"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import type { Card as CardType, Deck, SimulationResult } from "@/types";
import { fetchCards, fetchSessionResults } from "@/lib/apiClient";
import DeckBuilder from "@/components/DeckBuilder";
import Simulation from "@/components/Simulation";
import Card from "@/components/Card";
import WalletConnect from "@/components/WalletConnect";
import { isAddressWhitelisted } from "@/lib/whitelist";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedSessionId, setDetailedSessionId] = useState<string | null>(null);
  const [detailedResults, setDetailedResults] = useState<SimulationResult | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function loadCards() {
      try {
        const fetchedCards = await fetchCards();
        setCards(fetchedCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cards");
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const handleShowDetailedResults = async (sessionId: string) => {
    setDetailedSessionId(sessionId);
    setLoadingDetails(true);
    setError(null);
    try {
      const results = await fetchSessionResults(sessionId);
      setDetailedResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load detailed results");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBackToMain = () => {
    setDetailedSessionId(null);
    setDetailedResults(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-white/60 font-medium">Loading cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400/80 glass border border-red-500/20 rounded-xl p-4">{error}</div>
      </div>
    );
  }

  // Check wallet connection
  if (!isConnected) {
    return (
      <div className="min-h-screen city-pop-bg relative z-10">
        <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
            </h2>
            <WalletConnect />
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-1 border border-white/20 rounded-xl p-8 max-w-md text-center">
              <h3 className="text-2xl font-medium mb-4 text-white/90" style={{ letterSpacing: '-0.02em' }}>
                Connect Wallet
              </h3>
              <p className="text-white/60 mb-6">
                You need to connect your wallet to access the application. Use the button above to connect.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check whitelist
  if (!isAddressWhitelisted(address)) {
    return (
      <div className="min-h-screen city-pop-bg relative z-10">
        <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
            </h2>
            <WalletConnect />
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-1 border border-red-500/20 rounded-xl p-8 max-w-md text-center">
              <h3 className="text-2xl font-medium mb-4 text-red-400/90" style={{ letterSpacing: '-0.02em' }}>
                Access Restricted
              </h3>
              <p className="text-white/80 mb-2 font-medium">
                You are not allowed to alpha test
              </p>
              <p className="text-white/60 text-sm">
                Your wallet is not on the whitelist for alpha testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content for whitelisted users
  return (
    <div className="min-h-screen city-pop-bg relative z-10">
      <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
          </h2>
          <WalletConnect />
        </div>

        {detailedSessionId && detailedResults ? (
          // Detailed Results View
          <div className="space-y-6">
            <button
              onClick={handleBackToMain}
              className="glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              ← Back to Deck Builder
            </button>

            <div className="glass-1 border border-white/8 rounded-xl p-6">
              <h2 className="text-2xl font-medium mb-6 text-white" style={{ letterSpacing: '-0.02em' }}>
                Detailed Simulation Results
              </h2>

              {/* Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Final Score</div>
                  <div className="text-2xl font-semibold text-white">{detailedResults.final_score.toFixed(2)}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Market Position</div>
                  <div className="text-2xl font-semibold text-white">#{detailedResults.final_market_position}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Session ID</div>
                  <div className="text-xs font-mono text-white/80 break-all">{detailedResults.session_id}</div>
                </div>
              </div>

              {/* Daily Scores with Token Performance */}
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white/90">Daily Performance</h3>
                {detailedResults.daily_scores.map((daily) => (
                  <div key={typeof daily.day === 'string' ? daily.day : `day-${daily.day}`} className="glass border border-white/8 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-white capitalize">
                          {typeof daily.day === 'string' ? daily.day : `Day ${daily.day}`}
                        </h4>
                        <div className="text-sm text-white/60">Position: #{daily.market_position}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-white">{daily.score.toFixed(2)}</div>
                        <div className="text-xs text-white/60">Score</div>
                      </div>
                    </div>

                    {/* Token Performance */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <h5 className="text-sm font-medium text-white/80 mb-3">Token Performance</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {daily.tokens_performance.map((perf) => (
                          <div key={perf.symbol} className="glass border border-white/5 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="text-sm font-medium text-white">{perf.symbol}</div>
                                <div className="text-xs text-white/50">{perf.name}</div>
                              </div>
                              <span className={`text-xs font-medium ${
                                perf.daily_change_pct >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {perf.daily_change_pct >= 0 ? '+' : ''}{perf.daily_change_pct.toFixed(2)}%
                              </span>
                            </div>
                            <div className="text-xs text-white/60 space-y-1.5">
                              <div className="flex justify-between">
                                <span>Final Score:</span>
                                <span className="text-white font-medium">{perf.final_score.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Activity Score:</span>
                                <span className="text-white/80">{perf.activity_score.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Raw Score:</span>
                                <span className={`${perf.raw_score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {perf.raw_score >= 0 ? '+' : ''}{perf.raw_score.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Weekly Change:</span>
                                <span className={`${perf.weekly_change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {perf.weekly_change_pct >= 0 ? '+' : ''}{perf.weekly_change_pct.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>MC Factor:</span>
                                <span className="text-white/80">{perf.mc_factor.toFixed(4)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Main Deck Builder View
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Available Cards */}
            <div className="glass-1 p-6 rounded-xl">
              <h3 className="text-xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
                Available Cards
              </h3>
              <div style={{ maxHeight: 'calc(100vh - 208px - 1.5rem)' }} className="grid grid-cols-3 md:grid-cols-3 gap-4 overflow-y-auto">
                {cards.map((card) => {
                  const currentDeck = deck.cards;
                  const isInDeck = currentDeck.some((c) => c.id === card.id);
                  const WEIGHT_LIMIT = 250; // Tournament weight limit
                  const totalWeight = currentDeck.reduce(
                    (sum, c) => sum + c.baseScore,
                    0
                  );
                  const isDeckFull = currentDeck.length >= 5;
                  const wouldExceedLimit = totalWeight + card.baseScore > WEIGHT_LIMIT;
                  const isDisabled = isInDeck || isDeckFull || wouldExceedLimit;

                  return (
                    <Card
                      key={card.id}
                      card={card}
                      isInDeck={isInDeck}
                      isDisabled={isDisabled}
                      showHoverActions={true}
                      onClick={() => {
                        if (!isDisabled) {
                          setDeck({
                            cards: [...currentDeck, card],
                          });
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* My Deck & Simulation */}
            <div className="space-y-6">
              <DeckBuilder
                availableCards={cards}
                deck={deck}
                onDeckChange={setDeck}
              />
              <Simulation 
                playerDeck={deck} 
                availableCards={cards}
                onShowDetailedResults={handleShowDetailedResults}
              />
            </div>
          </div>
        )}

        {loadingDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass border border-white/20 rounded-xl p-6">
              <div className="text-white">Loading detailed results...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
