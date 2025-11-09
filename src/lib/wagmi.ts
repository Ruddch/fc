import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { abstractTestnet } from "viem/chains";
import { abstractWalletConnector } from "@abstract-foundation/agw-react/connectors";

export const config = createConfig({
  connectors: [abstractWalletConnector()],
  chains: [abstractTestnet, mainnet, sepolia],
  transports: {
    [abstractTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});

