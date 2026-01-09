"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUmi } from "../components/UmiProvider";
import { ChallengeCard } from "../components/ChallengeCard";
import { ChallengeDetail } from "../components/ChallengeDetail";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CHALLENGES } from "../data/challenges";
import { getAssetsForChallenge, getBurnFunction } from "../utils/assets";
import { getMintFunction } from "../utils/mint";
import { fetchAssetsByOwner, AssetV1 } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { Loader2, Zap, Shield, Box, Terminal } from "lucide-react";

export default function Home() {
  const { connected } = useWallet();
  const umi = useUmi();
  
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [allAssets, setAllAssets] = useState<AssetV1[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Fetch assets when connected
  const fetchAssets = async () => {
    if (!umi.identity.publicKey) return;
    setLoadingAssets(true);
    try {
      const assets = await fetchAssetsByOwner(umi, umi.identity.publicKey);
      setAllAssets(assets);
    } catch (e) {
      console.error("Error fetching assets", e);
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchAssets();
    } else {
      setAllAssets([]);
      setSelectedChallenge(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, umi.identity.publicKey]);

  const refreshAssets = async () => {
     await fetchAssets();
  };

  const handleMint = async (index: number) => {
    const mintFn = getMintFunction(index);
    if (!mintFn) return;

    // Capture current state of assets for this challenge
    const prevCount = getAssetsForChallenge(index, allAssets).length;
    
    // For Challenge 4, pass the callback to detect "Asset Found"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await mintFn(umi, (updatedAssets: any) => {
        if (updatedAssets) setAllAssets(updatedAssets);
    });
    
    // Poll for the new asset ensuring the indexer has picked it up
    let attempts = 0;
    while (attempts < 10) {
      await new Promise(r => setTimeout(r, 2000));
      const assets = await fetchAssetsByOwner(umi, umi.identity.publicKey);
      const newCount = getAssetsForChallenge(index, assets).length;
      
      if (newCount > prevCount) {
        setAllAssets(assets);
        break; 
      }
      attempts++;
    }
    
    await refreshAssets();
  };

  const handleBurn = async (index: number, asset: AssetV1) => {
    const burnFn = getBurnFunction(index);
    if (!burnFn) throw new Error("No burn function found");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assetAny = asset as any;
    const collectionKey = assetAny.updateAuthority?.type === 'Collection' 
      ? assetAny.updateAuthority.address 
      : undefined;

    const tx = await burnFn(umi, {
      asset: asset.publicKey,
      owner: umi.identity,
      ...(collectionKey && { collection: collectionKey }),
    }).sendAndConfirm(umi);

    await refreshAssets();
    return base58.deserialize(tx.signature)[0];
  };

  // Render Challenge Detail
  if (selectedChallenge !== null && connected) {
    const challenge = CHALLENGES[selectedChallenge];
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
            <ChallengeDetail
                index={challenge.index}
                title={challenge.title}
                description={challenge.description}
                reward={challenge.reward}
                steps={challenge.steps}
                assets={getAssetsForChallenge(selectedChallenge, allAssets)}
                loading={loadingAssets}
                onMint={() => handleMint(selectedChallenge)}
                onBurn={(asset) => handleBurn(selectedChallenge, asset)}
                onBack={() => setSelectedChallenge(null)}
            />
          </main>
          <Footer />
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {!connected ? (
          <div className="py-24 space-y-24">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm backdrop-blur-sm">
                <span className="text-[var(--muted)]">Available on Devnet</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.1]">
                Master the <br/>
                <span className="bg-gradient-to-r from-[var(--foreground)] to-[var(--muted)] bg-clip-text text-transparent">
                  MPL Core Standard
                </span>
              </h1>
              <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
                Complete interactive coding challenges to learn Metaplex Core and earn SOL rewards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Learn by Doing", desc: "Step-by-step challenges with real code examples" },
                { icon: Shield, title: "Earn Rewards", desc: "Get SOL for each completed challenge" },
                { icon: Box, title: "5 Challenges", desc: "From basic assets to advanced plugins" },
                { icon: Terminal, title: "Real Code", desc: "Copy code snippets directly to your projects" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="w-10 h-10 bg-[var(--background)] rounded-lg flex items-center justify-center mb-4 border border-[var(--border)]">
                    <Icon className="w-5 h-5 text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--muted)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border)] pb-6">
              <div>
                <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Challenges</h2>
                <p className="text-[var(--muted)] mt-2">Select a challenge to begin your learning journey.</p>
              </div>
              {loadingAssets && (
                <div className="bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)] flex items-center gap-2">
                  <Loader2 className="animate-spin w-3 h-3 text-[var(--foreground)]" />
                  <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Scanning...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHALLENGES.map((challenge) => (
                <ChallengeCard
                  key={challenge.index}
                  index={challenge.index}
                  title={challenge.title}
                  description={challenge.description}
                  reward={challenge.reward}
                  onSelect={() => setSelectedChallenge(challenge.index)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
