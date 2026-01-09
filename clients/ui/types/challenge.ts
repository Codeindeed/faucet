export interface ChallengeInteraction {
  question: string;
  options: string[];
  answer: string;
  successMessage?: string;
}

export interface CodingChallenge {
  initialCode: string;
  requiredString?: string; // If present, code must contain this string
  validationRegex?: RegExp; // Advanced validation
  placeholder?: string;
  hint?: string;
}
