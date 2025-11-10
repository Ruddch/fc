"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  isOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openOnboarding = () => setIsOpen(true);
  const closeOnboarding = () => setIsOpen(false);

  return (
    <OnboardingContext.Provider value={{ isOpen, openOnboarding, closeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

