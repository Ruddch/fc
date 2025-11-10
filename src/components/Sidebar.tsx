"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openOnboarding } = useOnboarding();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass hover-glow rounded-lg text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        ${mobileMenuOpen ? "block" : "hidden"} md:block
        fixed left-0 top-0 pl-6 z-20`
      }>
        <h1 
          className="text-3xl p-4 md:py-8 pt-16 md:p-8 md:px-0 font-medium font-sango glitch" 
          style={{ 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg,#CECFF7,#D8BCEB,#E6BEC6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Token Fantasy
        </h1>
        <div
          style={{ height: 'calc(100vh - 110px - 1.5rem)' }}
          className={`
            p-6
            pb-16
            w-80 glass-2
            rounded-xl
            flex flex-col justify-between
          `}
        >
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`
                w-full block transition-all
                ${
                  pathname === "/"
                    ? "pill-button active text-white"
                    : "pill-button text-white/70 hover:text-white"
                }
              `}
            >
              Home
            </Link>
            <button
              onClick={() => {
                openOnboarding();
                setMobileMenuOpen(false);
              }}
              className="w-full block transition-all pill-button text-white/70 hover:text-white text-left"
            >
              Rules
            </button>
            <div
              className="w-full block transition-all pill-button text-white/50 opacity-60 pointer-events-none cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <span>Leaderboard</span>
                <span className="text-xs text-white/40">Coming Soon</span>
              </div>
            </div>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-white/50">
              <div>Alpha 1.0</div>
              <div className="text-white/40">© By Invest Team</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

