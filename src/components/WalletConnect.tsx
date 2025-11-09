"use client";

import { ConnectKitButton } from "connectkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function WalletConnect() {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      localStorage.setItem("walletAddress", address);
    }
  }, [address]);

  return (
    <div className="flex items-center">
      <ConnectKitButton />
    </div>
  );
}

