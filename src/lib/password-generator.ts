export interface PasswordCriteria {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  crackTime: string;
  color: string;
}

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export function generateSecurePassword(criteria: PasswordCriteria): string {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = criteria;
  
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    throw new Error('At least one character type must be selected');
  }

  let charset = '';
  const requiredChars: string[] = [];

  if (includeUppercase) {
    charset += CHARSET.uppercase;
    requiredChars.push(getSecureRandomChar(CHARSET.uppercase));
  }
  if (includeLowercase) {
    charset += CHARSET.lowercase;
    requiredChars.push(getSecureRandomChar(CHARSET.lowercase));
  }
  if (includeNumbers) {
    charset += CHARSET.numbers;
    requiredChars.push(getSecureRandomChar(CHARSET.numbers));
  }
  if (includeSymbols) {
    charset += CHARSET.symbols;
    requiredChars.push(getSecureRandomChar(CHARSET.symbols));
  }

  // Generate remaining characters
  const remainingLength = Math.max(0, length - requiredChars.length);
  const remainingChars = Array.from({ length: remainingLength }, () => 
    getSecureRandomChar(charset)
  );

  // Combine and shuffle all characters
  const allChars = [...requiredChars, ...remainingChars];
  return shuffleArray(allChars).join('');
}

function getSecureRandomChar(charset: string): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return charset[array[0] % charset.length];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculatePasswordStrength(password: string, criteria: PasswordCriteria): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', crackTime: 'Instant', color: 'text-destructive' };
  }

  let score = 0;
  let charsetSize = 0;

  // Character set diversity
  if (criteria.includeUppercase && /[A-Z]/.test(password)) charsetSize += 26;
  if (criteria.includeLowercase && /[a-z]/.test(password)) charsetSize += 26;
  if (criteria.includeNumbers && /[0-9]/.test(password)) charsetSize += 10;
  if (criteria.includeSymbols && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 32;

  // Length scoring
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  // Diversity scoring
  if (charsetSize >= 94) score += 2; // All character types
  else if (charsetSize >= 62) score += 1; // Letters and numbers

  // Calculate entropy and crack time
  const entropy = Math.log2(Math.pow(charsetSize, password.length));
  const crackTime = calculateCrackTime(entropy);

  const strengthLevels = [
    { threshold: 0, label: 'Very Weak', color: 'text-destructive' },
    { threshold: 1, label: 'Weak', color: 'text-orange-600' },
    { threshold: 2, label: 'Fair', color: 'text-yellow-600' },
    { threshold: 3, label: 'Good', color: 'text-blue-600' },
    { threshold: 4, label: 'Strong', color: 'text-green-600' }
  ];

  const level = strengthLevels.reverse().find(level => score >= level.threshold) || strengthLevels[0];

  return {
    score: Math.min(score, 4),
    label: level.label,
    crackTime,
    color: level.color
  };
}

function calculateCrackTime(entropy: number): string {
  // Assume 1 billion guesses per second
  const secondsToGuess = Math.pow(2, entropy - 1) / 1e9;
  
  if (secondsToGuess < 1) return 'Instant';
  if (secondsToGuess < 60) return `${Math.round(secondsToGuess)} seconds`;
  if (secondsToGuess < 3600) return `${Math.round(secondsToGuess / 60)} minutes`;
  if (secondsToGuess < 86400) return `${Math.round(secondsToGuess / 3600)} hours`;
  if (secondsToGuess < 31536000) return `${Math.round(secondsToGuess / 86400)} days`;
  if (secondsToGuess < 31536000000) return `${Math.round(secondsToGuess / 31536000)} years`;
  
  return 'Centuries';
}