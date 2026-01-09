"use client";

import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeProvider";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-[var(--foreground)] rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-[var(--background)] rounded-sm transform rotate-45" />
        </div>
        <h1 className="text-xl font-medium tracking-tight text-[var(--foreground)]">
          MPL Faucet
          <span className="text-[var(--muted)] ml-2 font-normal">Challenges</span>
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <WalletMultiButton style={{ 
          backgroundColor: "var(--surface)", 
          color: "var(--foreground)",
          fontWeight: 500,
          borderRadius: "9999px",
          border: "1px solid var(--border)",
          padding: "0 24px",
          height: "40px",
          fontSize: "14px"
        }} />
      </div>
    </nav>
  );
};
