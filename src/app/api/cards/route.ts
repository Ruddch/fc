import { NextResponse } from "next/server";
import type { Card } from "@/types";

// Mock cards data - in production this would come from a database
const MOCK_CARDS: Card[] = [
  { id: "1", symbol: "BTC", name: "Bitcoin", baseScore: 50 },
  { id: "2", symbol: "ETH", name: "Ethereum", baseScore: 45 },
  { id: "3", symbol: "BNB", name: "BNB", baseScore: 40 },
  { id: "4", symbol: "SOL", name: "Solana", baseScore: 38 },
  { id: "5", symbol: "ADA", name: "Cardano", baseScore: 35 },
  { id: "6", symbol: "XRP", name: "Ripple", baseScore: 32 },
  { id: "7", symbol: "DOT", name: "Polkadot", baseScore: 30 },
  { id: "8", symbol: "DOGE", name: "Dogecoin", baseScore: 28 },
  { id: "9", symbol: "AVAX", name: "Avalanche", baseScore: 25 },
  { id: "10", symbol: "MATIC", name: "Polygon", baseScore: 22 },
  { id: "11", symbol: "LINK", name: "Chainlink", baseScore: 20 },
  { id: "12", symbol: "UNI", name: "Uniswap", baseScore: 18 },
  { id: "13", symbol: "ATOM", name: "Cosmos", baseScore: 16 },
  { id: "14", symbol: "ETC", name: "Ethereum Classic", baseScore: 15 },
  { id: "15", symbol: "LTC", name: "Litecoin", baseScore: 14 },
  { id: "16", symbol: "NEAR", name: "NEAR Protocol", baseScore: 12 },
  { id: "17", symbol: "ALGO", name: "Algorand", baseScore: 10 },
  { id: "18", symbol: "FIL", name: "Filecoin", baseScore: 8 },
  { id: "19", symbol: "TRX", name: "TRON", baseScore: 6 },
  { id: "20", symbol: "XLM", name: "Stellar", baseScore: 4 },
  { id: "21", symbol: "VET", name: "VeChain", baseScore: 3 },
  { id: "22", symbol: "ICP", name: "Internet Computer", baseScore: 2 },
];

export async function GET() {
  return NextResponse.json(MOCK_CARDS);
}

