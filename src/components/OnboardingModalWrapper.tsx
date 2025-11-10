"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAccount } from "wagmi";
import { isAddressWhitelisted } from "@/lib/whitelist";
import OnboardingModal from "./OnboardingModal";

export default function OnboardingModalWrapper() {
  const { isOpen, closeOnboarding } = useOnboarding();
  const { address } = useAccount();
  
  const handleClose = () => {
    // Save to localStorage if this is the first time closing for this wallet
    if (address && isAddressWhitelisted(address)) {
      const onboardingKey = `onboarding_shown_${address.toLowerCase()}`;
      const hasSeenOnboarding = localStorage.getItem(onboardingKey);
      
      if (!hasSeenOnboarding) {
        localStorage.setItem(onboardingKey, "true");
      }
    }
    closeOnboarding();
  };
  
  return <OnboardingModal isOpen={isOpen} onClose={handleClose} />;
}

