import type {
  ApiResponse,
  Token,
  Tournament,
  LockedDeck,
  Session,
  SimulationResult,
  DeckValidation,
  TokensResponse,
  SimulationTokensResponse,
  SessionsResponse,
  TokensStatsResponse,
  Card,
  SimulateSessionResponse,
} from "@/types";

// Base URL для API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.hodleague.com/";

// Вспомогательная функция для обработки ответов API
async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (!data.data) {
    throw new Error("No data in response");
  }

  return data.data;
}

// 1. GET /api/tokens - Получить все доступные игровые токены (30 токенов)
export async function fetchTokens(): Promise<TokensResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tokens`);
  return handleResponse<TokensResponse>(response);
}

// 2. GET /api/tokens/<symbol> - Получить детальную информацию о конкретном токене
export async function fetchTokenBySymbol(symbol: string): Promise<Token> {
  const response = await fetch(`${API_BASE_URL}/api/tokens/${symbol.toUpperCase()}`);
  return handleResponse<Token>(response);
}

// 3. GET /api/tournament - Получить информацию о текущем турнире
export async function fetchTournament(): Promise<Tournament> {
  const response = await fetch(`${API_BASE_URL}/api/tournament`);
  return handleResponse<Tournament>(response);
}

// 4. POST /api/lock-deck - Заблокировать колоду из 5 выбранных токенов
export async function lockDeck(
  walletAddress: string,
  selectedTokens: string[],
  sessionId?: string
): Promise<LockedDeck> {
  const response = await fetch(`${API_BASE_URL}/api/lock-deck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
      selected_tokens: selectedTokens.map((t) => t.toUpperCase()),
      ...(sessionId && { session_id: sessionId }),
    }),
  });
  return handleResponse<LockedDeck>(response);
}

// 5. GET /api/session/<session_id> - Получить информацию о конкретной игровой сессии
export async function fetchSession(sessionId: string): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`);
  return handleResponse<Session>(response);
}

// 6. GET /api/sessions - Получить все игровые сессии
export async function fetchSessions(): Promise<SessionsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/sessions`);
  return handleResponse<SessionsResponse>(response);
}

// 7. GET /api/simulation-tokens - Получить все 100 токенов для расчетов симуляции
export async function fetchSimulationTokens(): Promise<SimulationTokensResponse> {
  const response = await fetch(`${API_BASE_URL}/api/simulation-tokens`);
  return handleResponse<SimulationTokensResponse>(response);
}

// 8. GET /api/tokens-stats - Получить статистику о доступных токенах
export async function fetchTokensStats(): Promise<TokensStatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tokens-stats`);
  return handleResponse<TokensStatsResponse>(response);
}

// 9. POST /api/validate-deck - Проверить, соответствует ли колода требованиям турнира
export async function validateDeck(selectedTokens: string[]): Promise<DeckValidation> {
  const response = await fetch(`${API_BASE_URL}/api/validate-deck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selected_tokens: selectedTokens.map((t) => t.toUpperCase()),
    }),
  });
  return handleResponse<DeckValidation>(response);
}

// 10. POST /api/simulate-session - Запустить симуляцию для заблокированной колоды
export async function simulateSession(sessionId: string, selectedTokens: string[], walletAddress: string): Promise<SimulateSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/simulate-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      selected_tokens: selectedTokens,
      wallet_address: walletAddress,
    }),
  });
  return handleResponse<SimulateSessionResponse>(response);
}

// 11. GET /api/session/<session_id>/results - Получить детальные результаты симуляции
export async function fetchSessionResults(sessionId: string): Promise<SimulationResult> {
  const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}/results`);
  return handleResponse<SimulationResult>(response);
}

// Legacy функции для обратной совместимости
// Преобразует Token в Card для использования в существующих компонентах
export function tokenToCard(token: Token, index: number): Card {
  return {
    id: `${token.symbol}-${index}`,
    symbol: token.symbol,
    name: token.name,
    baseScore: token.tournament_weight,
    logo_url: token.logo_url,
    tournament_weight: token.tournament_weight,
  };
}

// Получить карты (токены) для использования в компонентах
export async function fetchCards(): Promise<Card[]> {
  const tokensResponse = await fetchTokens();
  return tokensResponse.tokens.map((token, index) => tokenToCard(token, index));
}
