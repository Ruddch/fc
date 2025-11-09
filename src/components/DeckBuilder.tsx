"use client";

import type { Card, Deck } from "@/types";
import CardComponent from "./Card";

interface DeckBuilderProps {
  availableCards: Card[];
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
}

export default function DeckBuilder({
  deck,
  onDeckChange,
}: DeckBuilderProps) {
  const selectedCards = deck.cards;

  const WEIGHT_LIMIT = 250; // Tournament weight limit

  const totalWeight = selectedCards.reduce(
    (sum, card) => sum + card.baseScore,
    0
  );

  const handleRemoveCard = (cardId: string) => {
    const newDeck = selectedCards.filter((c) => c.id !== cardId);
    onDeckChange({ cards: newDeck });
  };

  const isDeckValid = selectedCards.length === 5 && totalWeight <= WEIGHT_LIMIT;

  return (
    <div className="space-y-4">
      <div className="glass-1 p-6 rounded-xl">
        <h3 className="text-xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
          My Deck
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2 text-white/60">
            <span>Cards: {selectedCards.length}/5</span>
            <span>Weight: {totalWeight}/{WEIGHT_LIMIT}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all ${
                totalWeight > WEIGHT_LIMIT
                  ? "bg-red-500/40"
                  : totalWeight === WEIGHT_LIMIT
                  ? "bg-white/30"
                  : "bg-white/20"
              }`}
              style={{ width: `${Math.min((totalWeight / WEIGHT_LIMIT) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => {
            const card = selectedCards[index];
            if (card) {
              return (
                <div key={card.id} className="flex-shrink-0" style={{ width: 'calc(20% - 0.6rem)' }}>
                  <CardComponent
                    card={card}
                    isSelected={true}
                    showRemove={true}
                    onRemove={() => handleRemoveCard(card.id)}
                  />
                </div>
              );
            } else {
              return (
                <div key={`empty-${index}`} className="flex-shrink-0" style={{ width: 'calc(20% - 0.6rem)' }}>
                  <div className="w-full aspect-[2/3] rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              );
            }
          })}
        </div>
        {!isDeckValid && selectedCards.length > 0 && (
          <div className="mt-4 text-sm text-white/60">
            {selectedCards.length < 5
              ? `Select ${5 - selectedCards.length} more card(s)`
              : totalWeight > WEIGHT_LIMIT
              ? `Total weight exceeds ${WEIGHT_LIMIT}!`
              : ""}
          </div>
        )}
      </div>
    </div>
  );
}

