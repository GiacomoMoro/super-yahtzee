import { CategoryDefinition, CategoryId } from '../types/game';

export const UPPER_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'ones',
    section: 'upper',
    col1Label: '1 (Uno)',
    diceNumber: 1,
    col2Description: 'Somma di tutti gli 1',
    col2Formula: '1 × n dadi',
    isFixed: false,
    minScore: 0,
    maxScore: 6,
    step: 1,
    allowedValues: [0, 1, 2, 3, 4, 5, 6],
    hint: 'Valori ammessi: da 0 a 6 (max 6 dadi)',
  },
  {
    id: 'twos',
    section: 'upper',
    col1Label: '2 (Due)',
    diceNumber: 2,
    col2Description: 'Somma di tutti i 2',
    col2Formula: '2 × n dadi (solo numeri pari)',
    isFixed: false,
    minScore: 0,
    maxScore: 12,
    step: 2,
    allowedValues: [0, 2, 4, 6, 8, 10, 12],
    hint: 'Valori ammessi: multipli di 2 fino a 12 (0, 2, 4, 6, 8, 10, 12)',
  },
  {
    id: 'threes',
    section: 'upper',
    col1Label: '3 (Tre)',
    diceNumber: 3,
    col2Description: 'Somma di tutti i 3',
    col2Formula: '3 × n dadi (multipli di 3)',
    isFixed: false,
    minScore: 0,
    maxScore: 18,
    step: 3,
    allowedValues: [0, 3, 6, 9, 12, 15, 18],
    hint: 'Valori ammessi: multipli di 3 fino a 18 (0, 3, 6, 9, 12, 15, 18)',
  },
  {
    id: 'fours',
    section: 'upper',
    col1Label: '4 (Quattro)',
    diceNumber: 4,
    col2Description: 'Somma di tutti i 4',
    col2Formula: '4 × n dadi (multipli di 4)',
    isFixed: false,
    minScore: 0,
    maxScore: 24,
    step: 4,
    allowedValues: [0, 4, 8, 12, 16, 20, 24],
    hint: 'Valori ammessi: multipli di 4 fino a 24 (0, 4, 8, 12, 16, 20, 24)',
  },
  {
    id: 'fives',
    section: 'upper',
    col1Label: '5 (Cinque)',
    diceNumber: 5,
    col2Description: 'Somma di tutti i 5',
    col2Formula: '5 × n dadi (multipli di 5)',
    isFixed: false,
    minScore: 0,
    maxScore: 30,
    step: 5,
    allowedValues: [0, 5, 10, 15, 20, 25, 30],
    hint: 'Valori ammessi: multipli di 5 fino a 30 (0, 5, 10, 15, 20, 25, 30)',
  },
  {
    id: 'sixes',
    section: 'upper',
    col1Label: '6 (Sei)',
    diceNumber: 6,
    col2Description: 'Somma di tutti i 6',
    col2Formula: '6 × n dadi (multipli di 6)',
    isFixed: false,
    minScore: 0,
    maxScore: 36,
    step: 6,
    allowedValues: [0, 6, 12, 18, 24, 30, 36],
    hint: 'Valori ammessi: multipli di 6 fino a 36 (0, 6, 12, 18, 24, 30, 36)',
  },
];

export const LOWER_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'poker',
    section: 'lower',
    col1Label: 'Poker',
    col2Description: 'Almeno 4 dadi uguali',
    col2Formula: 'Somma di tutti i 6 dadi',
    isFixed: false,
    minScore: 6, // 4*1 + 1 + 1 = 6
    maxScore: 36, // 6*6 = 36
    allowedValues: undefined,
    hint: 'Valori ammessi: 0 (annullato) oppure somma di tutti i dadi (6-36)',
  },
  {
    id: 'five_of_a_kind',
    section: 'lower',
    col1Label: '5 of a Kind',
    col2Description: 'Almeno 5 dadi uguali',
    col2Formula: 'Somma di tutti i 6 dadi',
    isFixed: false,
    minScore: 6, // 5*1 + 1 = 6
    maxScore: 36,
    allowedValues: undefined,
    hint: 'Valori ammessi: 0 (annullato) oppure somma di tutti i dadi (6-36)',
  },
  {
    id: 'full',
    section: 'lower',
    col1Label: 'Full',
    col2Description: '4 dadi + 2 uguali o 3 + 3 uguali',
    col2Formula: 'Punteggio fisso: 25 pt',
    isFixed: true,
    fixedScore: 25,
    maxScore: 25,
    allowedValues: [0, 25],
    hint: 'Valori ammessi: solo 0 oppure 25',
  },
  {
    id: 'three_pairs',
    section: 'lower',
    col1Label: '3 Coppie',
    col2Description: '3 coppie distinte di dadi uguali',
    col2Formula: 'Punteggio fisso: 35 pt',
    isFixed: true,
    fixedScore: 35,
    maxScore: 35,
    allowedValues: [0, 35],
    hint: 'Valori ammessi: solo 0 oppure 35',
  },
  {
    id: 'small_straight',
    section: 'lower',
    col1Label: 'Scala Piccola',
    col2Description: 'Sequenza di 4 dadi consecutivi',
    col2Formula: 'Punteggio fisso: 30 pt',
    isFixed: true,
    fixedScore: 30,
    maxScore: 30,
    allowedValues: [0, 30],
    hint: 'Valori ammessi: solo 0 oppure 30',
  },
  {
    id: 'large_straight',
    section: 'lower',
    col1Label: 'Scala Grande',
    col2Description: 'Sequenza di 5 dadi consecutivi',
    col2Formula: 'Punteggio fisso: 40 pt',
    isFixed: true,
    fixedScore: 40,
    maxScore: 40,
    allowedValues: [0, 40],
    hint: 'Valori ammessi: solo 0 oppure 40',
  },
  {
    id: 'full_straight',
    section: 'lower',
    col1Label: 'Scala Completa',
    col2Description: 'Tutti i 6 dadi consecutivi (1-2-3-4-5-6)',
    col2Formula: 'Punteggio fisso: 50 pt',
    isFixed: true,
    fixedScore: 50,
    maxScore: 50,
    allowedValues: [0, 50],
    hint: 'Valori ammessi: solo 0 oppure 50',
  },
  {
    id: 'chance',
    section: 'lower',
    col1Label: 'Chance',
    col2Description: 'Qualsiasi combinazione di dadi',
    col2Formula: 'Somma di tutti i 6 dadi',
    isFixed: false,
    minScore: 6,
    maxScore: 36,
    allowedValues: undefined,
    hint: 'Valori ammessi: 0 (annullato) oppure somma di 6 dadi (6-36)',
  },
  {
    id: 'super_yahtzee',
    section: 'lower',
    col1Label: 'Super Yahtzee',
    col2Description: 'Tutti e 6 i dadi con lo stesso valore',
    col2Formula: 'Punteggio fisso: 75 pt',
    isFixed: true,
    fixedScore: 75,
    maxScore: 75,
    allowedValues: [0, 75],
    hint: 'Valori ammessi: solo 0 oppure 75',
  },
];

export const ALL_CATEGORIES: CategoryDefinition[] = [
  ...UPPER_CATEGORIES,
  ...LOWER_CATEGORIES,
];

export const CATEGORY_MAP: Record<CategoryId, CategoryDefinition> = ALL_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<CategoryId, CategoryDefinition>
);

export interface ValidationResult {
  isValid: boolean;
  parsedNumber: number | null;
  errorMessage?: string;
}

/**
 * Validates a category input string.
 * Empty string "" is considered valid (not yet filled).
 */
export function validateCategoryInput(
  categoryId: CategoryId,
  rawVal: string
): ValidationResult {
  const trimmed = rawVal.trim();
  if (trimmed === '') {
    return { isValid: true, parsedNumber: null };
  }

  // Check if it's an integer
  const num = Number(trimmed);
  if (!Number.isInteger(num) || isNaN(num)) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'Inserisci un numero intero valido',
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'I punteggi non possono essere negativi',
    };
  }

  // Allowed 0 for scratch in any category
  if (num === 0) {
    return { isValid: true, parsedNumber: 0 };
  }

  const def = CATEGORY_MAP[categoryId];
  if (!def) {
    return { isValid: true, parsedNumber: num };
  }

  // Upper section specific validations
  if (def.section === 'upper') {
    const diceVal = def.diceNumber || 1;
    if (num > def.maxScore) {
      return {
        isValid: false,
        parsedNumber: null,
        errorMessage: `Non consentito: massimo ${def.maxScore} (hai solo 6 dadi)`,
      };
    }

    if (num % diceVal !== 0) {
      return {
        isValid: false,
        parsedNumber: null,
        errorMessage:
          diceVal === 2
            ? 'Non consentito: deve essere un numero pari (multiplo di 2)'
            : `Non consentito: deve essere un multiplo di ${diceVal}`,
      };
    }

    return { isValid: true, parsedNumber: num };
  }

  // Lower section fixed categories
  if (def.isFixed && def.fixedScore !== undefined) {
    if (num !== def.fixedScore) {
      return {
        isValid: false,
        parsedNumber: null,
        errorMessage: `Non consentito: questa combinazione vale ${def.fixedScore} punti oppure 0 (se annullata)`,
      };
    }
    return { isValid: true, parsedNumber: num };
  }

  // Lower section sum categories (poker, five_of_a_kind, chance)
  if (num > 36) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'Non consentito: la somma massima di 6 dadi è 36 (6×6)',
    };
  }

  if (num < 6) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'Non consentito: la somma minima di 6 dadi è 6 (oppure 0 se annullata)',
    };
  }

  return { isValid: true, parsedNumber: num };
}

export const UPPER_BONUS_THRESHOLD = 84;
export const UPPER_BONUS_POINTS = 45;

export interface ScorecardTotals {
  upperSubtotal: number;
  upperBonus: number;
  hasUpperBonus: boolean;
  bonusGap: number; // points needed to reach bonus
  lowerSubtotal: number;
  grandTotal: number;
  filledCount: number;
  totalCategories: number;
  isComplete: boolean;
  hasAnyInvalid: boolean;
}

export function calculateTotals(scores: Record<CategoryId, string>): ScorecardTotals {
  let upperSubtotal = 0;
  let lowerSubtotal = 0;
  let filledCount = 0;
  let hasAnyInvalid = false;

  for (const cat of UPPER_CATEGORIES) {
    const raw = scores[cat.id] ?? '';
    const valRes = validateCategoryInput(cat.id, raw);
    if (!valRes.isValid) {
      hasAnyInvalid = true;
    } else if (valRes.parsedNumber !== null) {
      upperSubtotal += valRes.parsedNumber;
      filledCount++;
    }
  }

  for (const cat of LOWER_CATEGORIES) {
    const raw = scores[cat.id] ?? '';
    const valRes = validateCategoryInput(cat.id, raw);
    if (!valRes.isValid) {
      hasAnyInvalid = true;
    } else if (valRes.parsedNumber !== null) {
      lowerSubtotal += valRes.parsedNumber;
      filledCount++;
    }
  }

  const hasUpperBonus = upperSubtotal >= UPPER_BONUS_THRESHOLD;
  const upperBonus = hasUpperBonus ? UPPER_BONUS_POINTS : 0;
  const bonusGap = Math.max(0, UPPER_BONUS_THRESHOLD - upperSubtotal);
  const grandTotal = upperSubtotal + upperBonus + lowerSubtotal;
  const totalCategories = ALL_CATEGORIES.length;

  return {
    upperSubtotal,
    upperBonus,
    hasUpperBonus,
    bonusGap,
    lowerSubtotal,
    grandTotal,
    filledCount,
    totalCategories,
    isComplete: filledCount === totalCategories && !hasAnyInvalid,
    hasAnyInvalid,
  };
}

export function createEmptyScorecard(): Record<CategoryId, string> {
  const result = {} as Record<CategoryId, string>;
  for (const cat of ALL_CATEGORIES) {
    result[cat.id] = '';
  }
  return result;
}
