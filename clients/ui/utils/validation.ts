import { CodingChallenge } from '../types/challenge';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateChallengeCode(code: string, challenge: CodingChallenge): ValidationResult {
  // Strip comments (single line and block)
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');

  // Check required string against clean code
  if (challenge.requiredString && cleanCode.includes(challenge.requiredString)) {
    return { isValid: true, message: "Your code looks correct. You can proceed." };
  }
  
  // Check regex if provided
  if (challenge.validationRegex && challenge.validationRegex.test(cleanCode)) {
    return { isValid: true, message: "Your code looks correct. You can proceed." };
  }
  
  // Fallback if no specific validation (configured but empty rules)
  if (!challenge.requiredString && !challenge.validationRegex) {
     return { isValid: true, message: "Your code looks correct. You can proceed." };
  }

  // Failure
  return { 
    isValid: false, 
    message: challenge.hint 
      ? `Hint: ${challenge.hint}` 
      : `Make sure your code contains: "${challenge.requiredString}"`
  };
}
