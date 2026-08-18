export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username.trim());
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordAnalysis {
  strength: PasswordStrength;
  score: number; // 0 to 4
  feedback: string;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMixedCase: boolean;
}

export function analyzePassword(password: string): PasswordAnalysis {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score = 0;
  if (password.length >= 6) score++;
  if (hasMinLength) score++;
  if (hasNumber || hasSpecialChar) score++;
  if (hasMixedCase && (hasNumber && hasSpecialChar)) score++;

  let strength: PasswordStrength = 'weak';
  let feedback = 'Too weak. Use at least 8 characters with numbers and symbols.';

  if (score >= 4) {
    strength = 'strong';
    feedback = 'Strong password! 🔒';
  } else if (score >= 2) {
    strength = 'medium';
    feedback = 'Moderate strength. Add symbols or mix cases for better security.';
  }

  return {
    strength,
    score,
    feedback,
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    hasMixedCase,
  };
}
