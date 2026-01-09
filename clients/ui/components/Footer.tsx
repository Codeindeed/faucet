"use client";

import React from "react";
import { Github, ExternalLink, BookOpen } from "lucide-react";

/**
 * Footer component displaying links to Metaplex resources.
 * Includes links to the GitHub repo, Metaplex docs, and main Metaplex site.
 */
export const Footer = () => {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/blockiosaurus/faucet",
      icon: Github,
    },
    {
      label: "MPL Core Docs",
      href: "https://developers.metaplex.com/core",
      icon: BookOpen,
    },
    {
      label: "Metaplex",
      href: "https://www.metaplex.com",
      icon: ExternalLink,
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--foreground)] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[var(--background)] rounded-sm transform rotate-45" />
            </div>
            <div>
              <span className="text-[var(--foreground)] font-medium">MPL Faucet</span>
              <span className="text-[var(--muted)] ml-2 text-sm">by Metaplex</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-[var(--muted)] text-xs">
            Built on Solana • Powered by Metaplex Core
          </p>
        </div>
      </div>
    </footer>
  );
};
