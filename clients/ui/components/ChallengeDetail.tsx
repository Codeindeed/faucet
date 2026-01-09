"use client";

/**
 * ChallengeDetail Component
 * 
 * Full-page challenge view with step-by-step progression:
 * 1. Learn - Educational content with code examples and quiz
 * 2. Mint - Create the required asset type
 * 3. Burn - Burn the asset to claim SOL reward
 * 4. Complete - Success state with transaction link
 * 
 * Handles the complete challenge lifecycle including wallet interactions,
 * transaction signing, and asset state management.
 */

import React, { useState } from "react";
import { AssetV1 } from "@metaplex-foundation/mpl-core";
import { Loader2, CheckCircle, ArrowLeft, ArrowRight, Copy, Check, Sparkles, Play, Terminal } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
// Footer import removed
import { CodingChallenge, ChallengeInteraction } from "../types/challenge";
import { validateChallengeCode } from "../utils/validation";

interface ChallengeStep {
  title: string;
  description: string;
  code?: string;
  interaction?: ChallengeInteraction;
  codingChallenge?: CodingChallenge;
}

interface ChallengeDetailProps {
  index: number;
  title: string;
  description: string;
  reward: string;
  steps: ChallengeStep[];
  assets: AssetV1[];
  loading?: boolean;
  onMint: () => Promise<void>;
  onBurn: (asset: AssetV1) => Promise<string>;
  onBack: () => void;
}

export const ChallengeDetail = ({
  index,
  title,
  description,
  reward,
  steps,
  assets,
  loading = false,
  onMint,
  onBurn,
  onBack,
}: ChallengeDetailProps) => {
  // connected var removed
  const { } = useWallet(); 
  const [currentStep, setCurrentStep] = useState(0);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);


  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [userCode, setUserCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showCodeFeedback, setShowCodeFeedback] = useState(false);

  React.useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setShowFeedback(false);
    
    // Reset code state
    setShowCodeFeedback(false);
    if (steps[currentStep]?.codingChallenge) {
      setUserCode(steps[currentStep].codingChallenge!.initialCode);
      setCodeValid(false);
      setValidationMessage("");
    }
  }, [currentStep, steps]);

  const handleOptionSelect = (option: string) => {
    if (isCorrect) return; // Prevent changing after correct answer
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    const step = steps[currentStep];
    if (step.interaction && option === step.interaction.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleCodeCheck = () => {
    setShowCodeFeedback(true);
    const challenge = steps[currentStep].codingChallenge;
    if (!challenge) return;

    const { isValid, message } = validateChallengeCode(userCode, challenge);
    setCodeValid(isValid);
    setValidationMessage(message);
  };

  const handleMint = async () => {
    setMinting(true);
    setError(null);
    try {
      await onMint();
      setCurrentStep((prev) => prev + 1);
    } catch (e: unknown) {
      console.error(e);
      setError((e as Error).message || "Mint failed");
    } finally {
      setMinting(false);
    }
  };

  const handleBurn = async () => {
    if (assets.length === 0) return;
    setBurning(true);
    setError(null);
    try {
      const sig = await onBurn(assets[0]);
      setSuccess(sig);
      // We don't advance step for success, the UI switches based on 'success' state
      // But keeping it consistent if we want to show 'Complete' step in progress bar
      setCurrentStep((prev) => prev + 1); 
    } catch (e: unknown) {
      console.error(e);
      setError((e as Error).message || "Burn failed");
    } finally {
      setBurning(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const stepContent = steps[currentStep];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </button>
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-[0.2em]">
                Challenge {(index + 1).toString().padStart(2, '0')}
              </span>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mt-2">{title}</h1>
              <p className="text-[var(--muted)] mt-2 max-w-xl">{description}</p>
            </div>
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-right">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block">Reward</span>
              <span className="text-xl font-bold text-[var(--foreground)]">{reward}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-8">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    i === currentStep
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : i < currentStep
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                  )}
                  {step.title}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 ${i < currentStep ? "bg-green-500/40" : "bg-[var(--border)]"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
            <span className="font-bold text-red-400 block mb-1">Error</span>
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Challenge Complete!</h2>
            <p className="text-[var(--muted)] mb-8">You&apos;ve earned {reward}. Check your wallet!</p>
            <a
              href={`https://www.orbmarkets.io/tx/${success}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-6 py-3 text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
            >
              View Transaction
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={onBack}
              className="block mx-auto mt-6 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">{stepContent.description}</h2>
            </div>

            {/* Interaction / Question Area */}
            {stepContent.interaction && (
              <div className="space-y-6">
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center">?</span>
                    Quiz: Test your knowledge
                  </h3>
                  <p className="text-[var(--muted)] mb-6 text-sm">{stepContent.interaction.question}</p>
                  
                  <div className="grid gap-3">
                    {stepContent.interaction.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isWinningOption = stepContent.interaction?.answer === option;
                      
                      let cardStyle = "border-[var(--border)] hover:border-[var(--muted)] bg-[var(--background)] text-[var(--foreground)]";
                      if (showFeedback && isSelected) {
                        if (isWinningOption) {
                          cardStyle = "border-green-500/50 bg-green-500/10 text-green-200";
                        } else {
                          cardStyle = "border-red-500/50 bg-red-500/10 text-red-200";
                        }
                      } else if (isCorrect && isWinningOption) {
                         cardStyle = "border-green-500/50 bg-green-500/10 text-green-200";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          disabled={isCorrect}
                          className={`w-full text-left p-4 rounded-lg border text-sm transition-all ${cardStyle}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showFeedback && isSelected && (
                                isWinningOption ? <Check className="w-4 h-4" /> : <div className="text-red-400">✕</div>
                            )}
                            {isCorrect && !isSelected && isWinningOption && <Check className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className={`mt-4 text-sm p-3 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                      {isCorrect 
                        ? (stepContent.interaction.successMessage || "That's correct! You can now proceed.") 
                        : "Not quite. Check the code example and try again!"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Block */}
            {stepContent.code && (
              <div className="relative bg-[#1a1a1a] border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[#111]">
                  <span className="text-xs text-[var(--muted)] font-mono">TypeScript</span>
                  <button
                    onClick={() => copyCode(stepContent.code!)}
                    className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-[#e5e5e5]">{stepContent.code}</code>
                </pre>
              </div>
            )}

            {/* Coding Challenge Block */}
            {stepContent.codingChallenge && (
              <div className="space-y-4">
                <div className="relative bg-[#1a1a1a] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
                    <span className="text-xs text-[var(--muted)] font-mono flex items-center gap-2">
                       <Terminal className="w-3 h-3" />
                       Code Editor
                    </span>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => {
                      setUserCode(e.target.value);
                      if (showCodeFeedback) setShowCodeFeedback(false);
                    }}
                    className="w-full h-64 bg-[#0a0a0a] text-[#e5e5e5] p-4 font-mono text-sm focus:outline-none resize-none placeholder-gray-700"
                    placeholder={stepContent.codingChallenge.placeholder || "// Write your code here..."}
                    spellCheck={false}
                  />
                </div>
                
                {showCodeFeedback && (
                  <div className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
                    codeValid 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {codeValid ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current items-center justify-center flex text-[10px] font-bold">!</div>}
                    <div>
                      <span className="block font-medium">{codeValid ? "Success!" : "Not quite right"}</span>
                      <span className="opacity-80">
                        {validationMessage || (codeValid ? "Your code looks correct. You can proceed." : "Make sure to check the instructions.")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-8 border-t border-[var(--border)]">
              {stepContent.interaction && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!isCorrect}
                    className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center transition-colors ${
                      !isCorrect
                        ? "bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed border border-[var(--border)]"
                        : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                    }`}
                  >
                    {!isCorrect ? "Answer Quiz to Continue" : "I Understand, Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

              {stepContent.codingChallenge && (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (codeValid) {
                        if (assets.length > 0) {
                          setCurrentStep((prev) => prev + 1);
                        } else {
                          handleMint();
                        }
                      } else {
                        handleCodeCheck();
                      }
                    }}
                    disabled={codeValid && (minting || loading)}
                    className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center transition-colors ${
                       showCodeFeedback && !codeValid
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                    } ${codeValid && (minting || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {codeValid ? (
                      assets.length > 0 ? (
                        <>
                           Asset Found! Continue
                           <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        minting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Minting Asset...
                          </>
                        ) : (
                          <>
                            Mint Asset & Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )
                      )
                    ) : ( 
                      <>
                        Run & Verify Code
                        <Play className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}



              {stepContent.title === "Burn" && (
                <div className="space-y-4">
                  {assets.length > 0 ? (
                    <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                      <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block mb-2">Asset to Burn</span>
                      <span className="text-[var(--foreground)] font-medium">{assets[0].name}</span>
                      <span className="text-[var(--muted)] text-sm block mt-1 font-mono">
                        {assets[0].publicKey.toString().slice(0, 8)}...{assets[0].publicKey.toString().slice(-8)}
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-600">
                      No eligible asset found. Go back and mint one first.
                    </div>
                  )}

                  <button
                    onClick={handleBurn}
                    disabled={burning || assets.length === 0}
                    className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center transition-colors ${
                      burning || assets.length === 0
                        ? "bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed border border-[var(--border)]"
                        : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                    }`}
                  >
                    {burning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Burning & Claiming...
                      </>
                    ) : (
                      <>
                        Burn Asset & Claim {reward}
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
