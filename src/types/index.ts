// Token types from API
export type Token = {
  symbol: string;
  name: string;
  cmc_rank: number;
  market_cap: number;
  market_cap_formatted: string;
  current_price: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  logo_url: string;
  is_game_token: boolean;
  tournament_weight: number;
};

export type TokenWithStartingPrice = Token & {
  starting_price: number;
  starting_market_cap: number;
  starting_market_cap_formatted: string;
};

// Legacy Card type for backward compatibility
export type Card = {
  id: string;
  symbol: string;
  name: string;
  baseScore: number; // maps to tournament_weight
  logo_url?: string;
  tournament_weight?: number;
};

export type Deck = {
  cards: Card[];
  selected_tokens?: string[]; // token symbols
};

// Tournament types
export type TournamentRules = {
  deck_size: number;
  weight_limit: number;
  duration_days: number;
};

export type WeightTiers = {
  giants_80_100: Record<string, unknown>;
  major_60_79: Record<string, unknown>;
  mid_40_59: Record<string, unknown>;
  emerging_25_39: Record<string, unknown>;
  speculative_15_24: Record<string, unknown>;
};

export type Tournament = {
  tournament_id: string;
  name: string;
  status: string;
  rules: TournamentRules;
  weight_tiers: WeightTiers;
  example_strategies: string[];
};

// Session types
export type LockedDeck = {
  session_id: string;
  wallet_address: string;
  selected_tokens: TokenWithStartingPrice[];
  total_tokens: number;
  total_weight: number;
  weight_limit: number;
  weight_remaining: number;
  locked_at: string;
  expires_at: string;
  status: string;
};

export type Session = LockedDeck & {
  simulation_completed: boolean;
  final_score: number | null;
  simulation_results: SimulationResult | null;
};

// Simulation types
export type TokenPerformance = {
  symbol: string;
  name: string;
  activity_score: number;
  daily_change_pct: number;
  weekly_change_pct: number;
  raw_score: number;
  final_score: number;
  mc_factor: number;
};

export type DailyScore = {
  day: string | number; // Can be string like "tuesday" or number
  score: number;
  market_position: number;
  tokens_performance: TokenPerformance[]; // Array instead of Record
};

export type SimulationResult = {
  session_id: string;
  wallet_address: string;
  simulation_date: string;
  daily_scores: DailyScore[];
  final_score: number;
  final_market_position: number;
};

// Validation types
export type DeckValidation = {
  is_valid: boolean;
  deck_analysis: {
    total_tokens: number;
    total_weight: number;
    weight_limit: number;
    weight_remaining: number;
    weight_utilization: number;
  };
  token_breakdown: Array<{
    symbol: string;
    weight: number;
  }>;
  validation_checks: {
    correct_size: boolean;
    no_duplicates: boolean;
    valid_tokens: boolean;
    within_weight_limit: boolean;
  };
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type TokensResponse = {
  tokens: Token[];
  total_count: number;
  last_updated: string;
};

export type SimulationTokensResponse = TokensResponse & {
  game_tokens_count: number;
  other_tokens_count: number;
};

export type SessionsResponse = {
  sessions: Session[];
  total_count: number;
};

export type TokensStatsResponse = {
  game_tokens: {
    count: number;
    target: number;
  };
  simulation_tokens: {
    count: number;
    target: number;
    game_tokens_included: number;
    other_tokens_included: number;
  };
  last_updated: string;
};

