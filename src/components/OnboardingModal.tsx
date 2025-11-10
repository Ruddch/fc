"use client";

import { useEffect } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-1 border border-white/20 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-medium mb-2 text-white" style={{ letterSpacing: '-0.02em' }}>
              Welcome to HODLeague
            </h2>
            <p className="text-white/60">
              Learn how to play and maximize your score
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-3 text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-semibold text-purple-300">
                  1
                </span>
                Build Your Deck
              </h3>
              <p className="text-white/70 leading-relaxed">
                Select 5 cards from the available tokens. Each card has a base score and weight. 
                Your deck must not exceed 28 total weight points. Choose wisely to maximize your potential score!
              </p>
            </div>

            <div className="glass border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-3 text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-semibold text-blue-300">
                  2
                </span>
                Run Simulation
              </h3>
              <p className="text-white/70 leading-relaxed">
                Once your deck is ready, click &quot;Simulate&quot; to run a 5-day market simulation. 
                Your tokens will be evaluated based on their real market performance, activity scores, 
                and market capitalization factors.
              </p>
            </div>

            <div className="glass border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-3 text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-sm font-semibold text-green-300">
                  3
                </span>
                Track Performance
              </h3>
              <p className="text-white/70 leading-relaxed">
                Monitor your daily scores and market positions. View detailed results to see how each 
                token performed day by day, including price changes, activity scores, and market conditions.
              </p>
            </div>

            <div className="glass border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-3 text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-sm font-semibold text-yellow-300">
                  4
                </span>
                Score Calculation
              </h3>
              <p className="text-white/70 leading-relaxed">
                Your final score is calculated from multiple factors: token price changes, weekly performance, 
                market activity, and market cap weighting. The higher your score, the better your ranking!
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="pill-button active text-white px-6 py-3 font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

