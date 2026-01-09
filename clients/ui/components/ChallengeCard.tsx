"use client";

import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ChallengeCardProps {
  index: number;
  title: string;
  description: string;
  reward: string;
  completed?: boolean;
  onSelect?: () => void;
  href?: string;
}

export const ChallengeCard = ({
  index,
  title,
  description,
  reward,
  completed = false,
  onSelect,
  href,
}: ChallengeCardProps) => {
  const className = `w-full text-left bg-[var(--surface)] rounded-2xl p-6 border transition-all group block ${
    completed
      ? "border-green-500/30 hover:border-green-500/50"
      : "border-[var(--border)] hover:border-[var(--muted)]"
  }`;

  const content = (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-[0.2em]">
            Challenge {(index + 1).toString().padStart(2, '0')}
          </span>
          <h3 className="text-lg font-medium text-[var(--foreground)] mt-1 transition-colors">
            {title}
          </h3>
        </div>
        {completed ? (
          <div className="bg-green-500/20 p-2 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
        ) : (
          <div className="bg-[var(--border)] p-2 rounded-full group-hover:bg-[var(--muted)] transition-colors">
            <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
          </div>
        )}
      </div>
      
      <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Reward</span>
        <span className="text-sm font-medium text-[var(--foreground)]">{reward}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onSelect}
      className={className}
    >
      {content}
    </button>
  );
};
