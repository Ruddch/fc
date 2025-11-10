"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import type { SimulationResult, Session } from "@/types";
import { fetchSessionResults, fetchSession } from "@/lib/apiClient";
import WalletConnect from "@/components/WalletConnect";

// Функция для получения названия дня недели
function getDayName(dayNumber: number, simulationDate: string): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  try {
    const date = new Date(simulationDate);
    const firstDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const targetDay = (firstDay + dayNumber - 1) % 7;
    return days[targetDay];
  } catch {
    return `Day ${dayNumber}`;
  }
}

export default function DetailedSimulationResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const sessionId = params.sessionId as string;
  
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      if (!sessionId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [simulationData, sessionData] = await Promise.all([
          fetchSessionResults(sessionId),
          fetchSession(sessionId),
        ]);
        
        setSimulation(simulationData);
        setSession(sessionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load detailed results");
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [sessionId]);

  if (!isConnected) {
    return (
      <div className="min-h-screen city-pop-bg relative z-10">
        <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
              Detailed Simulation Results
            </h2>
            <WalletConnect />
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-1 border border-white/20 rounded-xl p-8 max-w-md text-center">
              <h3 className="text-2xl font-medium mb-4 text-white/90" style={{ letterSpacing: '-0.02em' }}>
                Connect Wallet
              </h3>
              <p className="text-white/60 mb-6">
                You need to connect your wallet to access the application.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen city-pop-bg relative z-10">
        <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-lg text-white/60 font-medium">Loading detailed results...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="min-h-screen city-pop-bg relative z-10">
        <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass border border-red-500/20 rounded-xl p-4 text-red-400/80 max-w-md">
              {error || "Detailed results not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Создаем мапу токенов с их логотипами
  const tokenLogoMap = new Map<string, string>();
  if (session?.selected_tokens) {
    session.selected_tokens.forEach(token => {
      tokenLogoMap.set(token.symbol, token.logo_url);
    });
  }

  return (
    <div className="min-h-screen city-pop-bg relative z-10">
      <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
              Detailed Simulation Results
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/simulate/${sessionId}`)}
                className="glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                ← Back to Summary
              </button>
              <button
                onClick={() => router.push('/')}
                className="glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Home
              </button>
            </div>
          </div>

          {/* Simulation Overview */}
          <div className="glass-1 border border-white/8 rounded-xl p-6">
            <h3 className="text-xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
              Simulation Overview
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Session ID</div>
                <div className="text-xs font-mono text-white/80 break-all">{simulation.session_id}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Wallet Address</div>
                <div className="text-xs font-mono text-white/80 break-all">{simulation.wallet_address}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Simulation Date</div>
                <div className="text-sm text-white/80">{new Date(simulation.simulation_date).toLocaleString()}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Final Score</div>
                <div className="text-2xl font-semibold text-white">{simulation.final_score.toFixed(2)}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Final Market Position</div>
                <div className="text-2xl font-semibold text-white">#{simulation.final_market_position}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Total Days</div>
                <div className="text-2xl font-semibold text-white">{simulation.daily_scores.length}</div>
              </div>
            </div>
          </div>

          {/* Session Information */}
          {session && (
            <div className="glass-1 border border-white/8 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
                Session Information
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Status</div>
                  <div className="text-sm font-medium text-white capitalize">{session.status}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Total Tokens</div>
                  <div className="text-2xl font-semibold text-white">{session.total_tokens}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Total Weight</div>
                  <div className="text-2xl font-semibold text-white">{session.total_weight}/{session.weight_limit}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Weight Remaining</div>
                  <div className="text-2xl font-semibold text-white">{session.weight_remaining}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Locked At</div>
                  <div className="text-sm text-white/80">{new Date(session.locked_at).toLocaleString()}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Expires At</div>
                  <div className="text-sm text-white/80">{new Date(session.expires_at).toLocaleString()}</div>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Simulation Completed</div>
                  <div className="text-sm font-medium text-white">{session.simulation_completed ? 'Yes' : 'No'}</div>
                </div>
                {session.final_score !== null && (
                  <div className="glass border border-white/8 rounded-xl p-4">
                    <div className="text-sm text-white/60 mb-1">Session Final Score</div>
                    <div className="text-2xl font-semibold text-white">{session.final_score.toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* Selected Tokens */}
              {session.selected_tokens && session.selected_tokens.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4 text-white/90">Selected Tokens</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {session.selected_tokens.map((token) => (
                      <div key={token.symbol} className="glass border border-white/8 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {token.logo_url && (
                            <img 
                              src={token.logo_url} 
                              alt={token.symbol}
                              className="w-10 h-10 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-base font-medium text-white">{token.symbol}</div>
                            <div className="text-xs text-white/50">{token.name}</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-white/60">
                          <div className="flex justify-between">
                            <span>CMC Rank:</span>
                            <span className="text-white/80">{token.cmc_rank}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tournament Weight:</span>
                            <span className="text-white/80">{token.tournament_weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Starting Price:</span>
                            <span className="text-white/80">${token.starting_price.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Starting Market Cap:</span>
                            <span className="text-white/80">{token.starting_market_cap_formatted}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Daily Scores with Full Token Performance */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white/90">Daily Performance Details</h3>
            {simulation.daily_scores.map((daily, dayIndex) => {
              const dayName = getDayName(daily.day, simulation.simulation_date);
              return (
                <div key={`day-${daily.day}`} className="glass border border-white/8 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-xl font-medium text-white">
                        {dayName} (Day {daily.day})
                      </h4>
                      <div className="text-sm text-white/60 mt-1">
                        Market Position: #{daily.market_position} • Score: {daily.score.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Token Performance - All Fields */}
                  {daily.tokens_performance.length > 0 && (
                    <div className="space-y-4">
                      {daily.tokens_performance.map((perf) => {
                        const logoUrl = tokenLogoMap.get(perf.symbol);
                        return (
                          <div key={perf.symbol} className="glass border border-white/5 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                              {logoUrl && (
                                <img 
                                  src={logoUrl} 
                                  alt={perf.symbol}
                                  className="w-10 h-10 rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-base font-medium text-white">{perf.symbol}</div>
                                <div className="text-xs text-white/50">{perf.name}</div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Scores */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2">Scores</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Final Score:</span>
                                    <span className="text-white font-medium">{perf.final_score.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Raw Score:</span>
                                    <span className="text-white/80">{perf.raw_score.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Activity Score:</span>
                                    <span className="text-white/80">{perf.activity_score.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Activity Metrics */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2">Activity</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Activity Points:</span>
                                    <span className="text-white/80">{perf.activity_points}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Activity Rank:</span>
                                    <span className="text-white/80">#{perf.activity_rank}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Activity Contribution:</span>
                                    <span className="text-white/80">{perf.activity_contribution.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Changes */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2">Changes</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Daily Change:</span>
                                    <span className={`font-medium ${perf.daily_change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {perf.daily_change_pct >= 0 ? '+' : ''}{perf.daily_change_pct.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Period Change:</span>
                                    <span className={`font-medium ${perf.period_change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {perf.period_change_pct >= 0 ? '+' : ''}{perf.period_change_pct.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Change Rank:</span>
                                    <span className="text-white/80">#{perf.change_rank}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Weekly Metrics */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2">Weekly</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Weekly Contribution:</span>
                                    <span className="text-white/80">{perf.weekly_contribution.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Weekly Points:</span>
                                    <span className="text-white/80">{perf.weekly_points}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Market Cap Factor */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2">Market Cap</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-white/60">MC Factor:</span>
                                    <span className="text-white/80">{perf.mc_factor.toFixed(4)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

