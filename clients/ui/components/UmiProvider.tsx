"use client";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplFaucet } from "@metaplex-foundation/mpl-faucet";
import { useWallet } from "@solana/wallet-adapter-react";
import { Umi, createNoopSigner, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { createContext, useContext, useEffect, useState } from "react";

const UmiContext = createContext<Umi | null>(null);

export const useUmi = () => {
  const context = useContext(UmiContext);
  if (!context) throw new Error("useUmi must be used within UmiProvider");
  return context;
};

export default function UmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallet = useWallet();
  const [umi, setUmi] = useState<Umi | null>(null);

  useEffect(() => {
    const u = createUmi("https://api.devnet.solana.com")
      .use(mplCore())
      .use(mplFaucet());

    if (wallet.connected && wallet.publicKey) {
      u.use(walletAdapterIdentity(wallet));
    } else {
      u.use(signerIdentity(createNoopSigner(publicKey("11111111111111111111111111111111"))));
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUmi(u);
  }, [wallet.connected, wallet.publicKey, wallet]);

  if (!umi) return null;

  return <UmiContext.Provider value={umi}>{children}</UmiContext.Provider>;
}
