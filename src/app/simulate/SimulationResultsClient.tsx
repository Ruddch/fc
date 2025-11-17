"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import type { SimulationResult, Session, TokenFinalStats } from "@/types";
import { fetchSessionResults, fetchSession, fetchSimulationTokens } from "@/lib/apiClient";
import WalletConnect from "@/components/WalletConnect";

// Функция для получения названия дня недели
function getDayName(dayNumber: number, simulationDate: string): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  try {
    const date = new Date(simulationDate);
    // Первый день симуляции - это день начала
    // getDay() возвращает 0 для воскресенья, 1 для понедельника и т.д.
    // Преобразуем в формат где понедельник = 0
    const firstDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
    // Вычисляем день недели для указанного дня симуляции
    const targetDay = (firstDay + dayNumber - 1) % 7;
    return days[targetDay];
  } catch {
    return `Day ${dayNumber}`;
  }
}

export default function SimulationResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const sessionId = searchParams.get('sessionId') || '';
  
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenLogos, setTokenLogos] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    async function loadResults() {
      if (!sessionId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем результаты симуляции, информацию о сессии и все токены для логотипов
        const [simulationData, sessionData, tokensData] = await Promise.all([
          fetchSessionResults(sessionId),
          fetchSession(sessionId),
          fetchSimulationTokens().catch(() => null), // Не критично, если не загрузится
        ]);
        
        setSimulation(simulationData);
        setSession(sessionData);
        
        // Создаем мапу символов токенов к их логотипам
        if (tokensData) {
          const logosMap = new Map<string, string>();
          tokensData.tokens.forEach(token => {
            logosMap.set(token.symbol.toUpperCase(), token.logo_url);
          });
          setTokenLogos(logosMap);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load simulation results");
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
              Simulation Results
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
            <div className="text-lg text-white/60 font-medium">Loading simulation results...</div>
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
              {error || "Simulation results not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen city-pop-bg relative z-10">
      <div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-white/90" style={{ letterSpacing: '-0.02em' }}>
              Simulation Results
            </h2>
            <div className="flex gap-2">
              
              <button
                onClick={() => router.push('/')}
                className="glass border border-white/12 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                ← Back to Deck Builder
              </button>
            </div>
          </div>

          {/* Session Info */}
          {session && (
            <div className="glass-1 border border-white/8 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
                Session Information
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass border border-white/8 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Session ID</div>
                  <div className="text-xs font-mono text-white/80 break-all">{session.session_id}</div>
                </div>
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
              </div>
            </div>
          )}

          {/* Final Score */}
          <div className="glass-1 border border-white/8 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass border border-white/8 rounded-xl p-6 text-center">
                <div className="text-sm text-white/60 mb-2">Final Score</div>
                <div className="text-4xl font-semibold text-white">{simulation.final_score.toFixed(2)}</div>
              </div>
              <div className="glass border border-white/8 rounded-xl p-6 text-center">
                <div className="text-sm text-white/60 mb-2">Market Position</div>
                <div className="text-4xl font-semibold text-white">#{simulation.final_market_position}</div>
              </div>
            </div>
          </div>

          {/* Daily Performance */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-white/90">Daily Performance</h3>
            {simulation.daily_scores.map((daily, dayIndex) => {
              const dayName = getDayName(daily.day, simulation.simulation_date);
              // Создаем мапу символов токенов к их данным из сессии
              const tokenLogoMap = new Map<string, string>();
              const tokenMarketCapMap = new Map<string, string>();
              if (session?.selected_tokens) {
                session.selected_tokens.forEach(token => {
                  tokenLogoMap.set(token.symbol, token.logo_url);
                  tokenMarketCapMap.set(token.symbol, token.starting_market_cap_formatted);
                });
              }

              // Получаем предыдущий день для сравнения скоров
              const previousDay = dayIndex > 0 ? simulation.daily_scores[dayIndex - 1] : null;
              const previousDayScores = new Map<string, number>();
              if (previousDay?.tokens_performance) {
                previousDay.tokens_performance.forEach(perf => {
                  previousDayScores.set(perf.symbol, perf.final_score);
                });
              }

              return (
                <div key={`day-${daily.day}`} className="glass border border-white/8 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6 gap-4">
                    <div>
                      <h4 className="text-xl font-medium text-white">
                        {dayName}
                      </h4>
                      <div className="text-sm text-white/60 mt-1">Day {daily.day} • Top {daily.market_position}%</div>
                    </div>
                    
                    {/* Market Overview - Between Day and Score */}
                    {simulation.market_overview && simulation.market_overview[daily.day] && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                          <span className="text-sm text-white/60">Market Overview:</span>
                          <span className="text-sm text-white/80">
                            {simulation.market_overview[daily.day].description}
                          </span>
                          <div className={`flex items-center gap-1 font-medium text-lg ${
                            simulation.market_overview[daily.day].actual_market_change_pct >= 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {simulation.market_overview[daily.day].actual_market_change_pct >= 0 ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                            <span>
                              {simulation.market_overview[daily.day].actual_market_change_pct >= 0 ? '+' : ''}
                              {simulation.market_overview[daily.day].actual_market_change_pct.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-right">
                      <div className="text-3xl font-semibold text-white">{daily.score.toFixed(2)}</div>
                      <div className="text-xs text-white/60">Score</div>
                    </div>
                  </div>

                  {/* Token Performance */}
                  {daily.tokens_performance.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <h5 className="text-sm font-medium text-white/80 mb-4">Token Performance</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {daily.tokens_performance.map((perf) => {
                          const isPositive = perf.daily_change_pct >= 0;
                          const logoUrl = tokenLogoMap.get(perf.symbol);
                          const marketCap = tokenMarketCapMap.get(perf.symbol);
                          
                          // Сравниваем скор с предыдущим днем
                          const previousScore = previousDayScores.get(perf.symbol);
                          const scoreChanged = previousScore !== undefined;
                          const scoreIncreased = scoreChanged && perf.final_score > previousScore;
                          const scoreDecreased = scoreChanged && perf.final_score < previousScore;

                          return (
                            <div key={perf.symbol} className="glass border border-white/5 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {logoUrl && (
                                    <img 
                                      src={logoUrl} 
                                      alt={perf.symbol}
                                      className="w-8 h-8 rounded-full"
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
                                <div className="text-right">
                                  <div className={`text-2xl font-semibold ${
                                    scoreIncreased 
                                      ? 'text-green-400' 
                                      : scoreDecreased 
                                      ? 'text-red-400' 
                                      : 'text-white'
                                  }`}>
                                    {perf.final_score.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-white/60 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span>Daily Change:</span>
                                  <div className={`flex items-center gap-1 font-medium ${
                                    isPositive ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {isPositive ? (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    )}
                                    <span>{isPositive ? '+' : ''}{perf.daily_change_pct.toFixed(2)}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Period Change:</span>
                                  <div className={`flex items-center gap-1 font-medium ${
                                    perf.period_change_pct >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {perf.period_change_pct >= 0 ? (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    )}
                                    <span>{perf.period_change_pct >= 0 ? '+' : ''}{perf.period_change_pct.toFixed(2)}%</span>
                                  </div>
                                </div>
                                {marketCap && (
                                  <div className="flex justify-between">
                                    <span>Market Cap:</span>
                                    <span className="text-white/80">{marketCap}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Score Breakdown */}
          {simulation && session && (() => {
            // Получаем последний день (финальные результаты)
            const finalDay = simulation.daily_scores[simulation.daily_scores.length - 1];
            if (!finalDay || !finalDay.tokens_performance) return null;

            // Создаем мапу токенов с их данными
            const tokenDataMap = new Map<string, { contribution: number; weight: number; logo: string; name: string }>();
            
            // Заполняем данные из последнего дня
            finalDay.tokens_performance.forEach(perf => {
              const token = session.selected_tokens?.find(t => t.symbol === perf.symbol);
              if (token) {
                tokenDataMap.set(perf.symbol, {
                  contribution: perf.final_score,
                  weight: token.tournament_weight,
                  logo: token.logo_url,
                  name: perf.name,
                });
              }
            });

            // Рассчитываем проценты
            const totalContribution = Array.from(tokenDataMap.values()).reduce((sum, data) => sum + data.contribution, 0);
            const tokenContributions = Array.from(tokenDataMap.entries()).map(([symbol, data]) => ({
              symbol,
              name: data.name,
              contribution: data.contribution,
              percentage: totalContribution > 0 ? (data.contribution / totalContribution) * 100 : 0,
              weight: data.weight,
              logo: data.logo,
            })).sort((a, b) => b.contribution - a.contribution);

            // Цвета для диаграммы
            const colors = [
              '#3B82F6', // blue
              '#10B981', // green
              '#F59E0B', // amber
              '#EF4444', // red
              '#8B5CF6', // purple
            ];

            // Функция для преобразования полярных координат в декартовы
            const polarToCartesian = (radius: number, angleInDegrees: number) => {
              const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
              return {
                x: radius + (radius * Math.cos(angleInRadians)),
                y: radius + (radius * Math.sin(angleInRadians))
              };
            };

            // Функция для создания SVG пути круговой диаграммы
            const createPieSlice = (startAngle: number, endAngle: number, radius: number, innerRadius: number = 0) => {
              const start = polarToCartesian(radius, endAngle);
              const end = polarToCartesian(radius, startAngle);
              const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
              
              if (innerRadius > 0) {
                const innerStart = polarToCartesian(innerRadius, endAngle);
                const innerEnd = polarToCartesian(innerRadius, startAngle);
                return [
                  `M ${start.x} ${start.y}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
                  `L ${innerEnd.x} ${innerEnd.y}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
                  "Z"
                ].join(" ");
              } else {
                return [
                  `M ${radius} ${radius}`,
                  `L ${start.x} ${start.y}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
                  "Z"
                ].join(" ");
              }
            };

            let currentAngle = 0;
            const radius = 120;

            return (
              <div className="glass-1 border border-white/8 rounded-xl p-6">
                <h3 className="text-xl font-medium mb-6 text-white" style={{ letterSpacing: '-0.02em' }}>
                  Final Score Breakdown
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
                      {tokenContributions.map((token, index) => {
                        const sliceAngle = (token.percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + sliceAngle;
                        const path = createPieSlice(startAngle, endAngle, radius);
                        const color = colors[index % colors.length];
                        currentAngle = endAngle;
                        
                        return (
                          <path
                            key={token.symbol}
                            d={path}
                            fill={color}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="2"
                            className="transition-opacity hover:opacity-80"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  {/* Token List */}
                  <div className="space-y-3">
                    {tokenContributions.map((token, index) => {
                      const color = colors[index % colors.length];
                      return (
                        <div key={token.symbol} className="glass border border-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              {token.logo && (
                                <img 
                                  src={token.logo} 
                                  alt={token.symbol}
                                  className="w-8 h-8 rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-white">{token.symbol}</div>
                                <div className="text-xs text-white/50">{token.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">
                                {token.percentage.toFixed(1)}%
                              </div>
                              <div className="text-xs text-white/60">
                                Weight: {token.weight}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-white/60">
                            Final Score: {token.contribution.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tokens Leaderboard */}
          {simulation.all_tokens_final && Object.keys(simulation.all_tokens_final).length > 0 && (
            <div className="glass-1 border border-white/8 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-6 text-white" style={{ letterSpacing: '-0.02em' }}>
                Tokens Leaderboard
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Symbol</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Final Score</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Activity Rank</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Change Rank</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Period Change</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Преобразуем объект в массив и сортируем по final_score
                      const tokensArray: Array<[string, TokenFinalStats]> = Object.entries(simulation.all_tokens_final);
                      const sortedTokens = tokensArray.sort((a, b) => b[1].final_score - a[1].final_score);
                      
                      return sortedTokens.map(([symbol, stats], index) => {
                        const rank = index + 1;
                        const formatMarketCap = (value: number): string => {
                          if (value >= 1e9) {
                            return `$${(value / 1e9).toFixed(2)}B`;
                          } else if (value >= 1e6) {
                            return `$${(value / 1e6).toFixed(2)}M`;
                          } else if (value >= 1e3) {
                            return `$${(value / 1e3).toFixed(2)}K`;
                          }
                          return `$${value.toFixed(2)}`;
                        };

                        return (
                          <tr 
                            key={symbol} 
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${
                                  rank === 1 ? 'text-yellow-400' :
                                  rank === 2 ? 'text-gray-300' :
                                  rank === 3 ? 'text-amber-600' :
                                  'text-white/80'
                                }`}>
                                  #{rank}
                                </span>
                                {rank <= 3 && (
                                  <span className="text-lg">
                                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {tokenLogos.has(symbol.toUpperCase()) && (
                                  <img 
                                    src={tokenLogos.get(symbol.toUpperCase())!} 
                                    alt={symbol}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="text-base font-medium text-white">{symbol}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-base font-semibold text-white">{stats.final_score.toFixed(2)}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm text-white/80">#{stats.activity_rank}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm text-white/80">#{stats.change_rank}</div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className={`text-sm font-medium ${
                                stats.period_change >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {stats.period_change >= 0 ? '+' : ''}{stats.period_change.toFixed(2)}%
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="text-sm text-white/80">{formatMarketCap(stats.market_cap)}</div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

