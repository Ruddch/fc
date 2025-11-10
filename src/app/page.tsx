"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import type { Card as CardType, Deck } from "@/types";
import { fetchCards } from "@/lib/apiClient";
import DeckBuilder from "@/components/DeckBuilder";
import Simulation from "@/components/Simulation";
import Card from "@/components/Card";
import WalletConnect from "@/components/WalletConnect";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { isAddressWhitelisted } from "@/lib/whitelist";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openOnboarding } = useOnboarding();

  useEffect(() => {
    async function loadCards() {
      try {
        const fetchedCards = await fetchCards();
        // Sort cards by weight (baseScore) in descending order
        const sortedCards = [...fetchedCards].sort((a, b) => b.baseScore - a.baseScore);
        setCards(sortedCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cards");
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  // Check if onboarding should be shown after wallet connection
  useEffect(() => {
    if (isConnected && address && isAddressWhitelisted(address)) {
      const onboardingKey = `onboarding_shown_${address.toLowerCase()}`;
      const hasSeenOnboarding = localStorage.getItem(onboardingKey);
      
      if (!hasSeenOnboarding) {
        openOnboarding();
      }
    }
  }, [isConnected, address, openOnboarding]);


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

        {/* Main Deck Builder View */}
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
                  const WEIGHT_LIMIT = 28; // Tournament weight limit
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
              />
            </div>
          </div>
      </div>
    </div>
  );
}
