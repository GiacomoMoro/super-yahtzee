export type CategoryId =
  // Sezione Superiore
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  // Sezione Inferiore
  | 'poker'
  | 'five_of_a_kind'
  | 'full'
  | 'three_pairs'
  | 'small_straight'
  | 'large_straight'
  | 'full_straight'
  | 'chance'
  | 'super_yahtzee';

export type CategorySection = 'upper' | 'lower';

export interface CategoryDefinition {
  id: CategoryId;
  section: CategorySection;
  col1Label: string;
  diceNumber?: number;
  col2Description: string;
  col2Formula: string;
  isFixed: boolean;
  fixedScore?: number;
  minScore?: number;
  maxScore: number;
  step?: number;
  allowedValues?: number[];
  hint: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  notes?: string;
  groupTag?: string;
}

export interface PlayerScoreState {
  playerId: string;
  scores: Record<CategoryId, string>; // string to allow clean controlled typing, e.g. "" or "12"
}

export interface MatchPlayerResult {
  playerId: string;
  playerName: string;
  playerColor: string;
  scores: Record<CategoryId, number | null>;
  upperSubtotal: number;
  upperBonus: number;
  lowerSubtotal: number;
  grandTotal: number;
  isWinner: boolean;
}

export interface MatchRecord {
  id: string;
  date: string; // ISO string
  groupName: string;
  playerResults: MatchPlayerResult[];
  notes?: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  playerColor: string;
  totalGames: number;
  wins: number;
  winRate: number;
  highScore: number;
  averageScore: number;
  bonusCount: number;
  bonusRate: number;
  superYahtzeeCount: number;
  recentScores: number[];
}
