import { NextResponse } from "next/server";
import type { Deck, SimulationResult } from "@/types";

// Simple simulation logic - adds some randomness to base scores
function calculateFinalScore(baseScore: number): number {
  // Add random multiplier between 0.8 and 1.2
  const multiplier = 0.8 + Math.random() * 0.4;
  return Math.round(baseScore * multiplier);
}

export async function POST(request: Request) {
  try {
    const { playerDeck, opponentDeck } = await request.json() as {
      playerDeck: Deck;
      opponentDeck: Deck;
    };

    // Calculate user score
    const userBreakdown = playerDeck.cards.map((card) => ({
      cardId: card.id,
      baseScore: card.baseScore,
      finalScore: calculateFinalScore(card.baseScore),
    }));
    const userScore = userBreakdown.reduce(
      (sum, item) => sum + item.finalScore,
      0
    );

    // Calculate opponent score
    const opponentBreakdown = opponentDeck.cards.map((card) => ({
      cardId: card.id,
      baseScore: card.baseScore,
      finalScore: calculateFinalScore(card.baseScore),
    }));
    const opponentScore = opponentBreakdown.reduce(
      (sum, item) => sum + item.finalScore,
      0
    );

    // Determine outcome
    let outcome: "win" | "lose" | "draw";
    if (userScore > opponentScore) {
      outcome = "win";
    } else if (userScore < opponentScore) {
      outcome = "lose";
    } else {
      outcome = "draw";
    }

    const result: SimulationResult = {
      userScore,
      opponentScore,
      outcome,
      userBreakdown,
      opponentBreakdown,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

