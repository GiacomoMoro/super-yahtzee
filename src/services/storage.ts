import { MatchRecord, Player, PlayerStats, CategoryId } from '../types/game';

const PLAYERS_KEY = 'super_yahtzee_players_v1';
const MATCHES_KEY = 'super_yahtzee_matches_v1';
const ACTIVE_GAME_KEY = 'super_yahtzee_active_game_v1';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Giacomo',
    color: '#0284c7', // Sky 600
    createdAt: new Date().toISOString(),
    notes: 'Giocatore Principale',
    groupTag: 'Casa',
  },
];

export interface ActiveGameState {
  selectedPlayerIds: string[];
  currentPlayerId: string;
  scoresByPlayer: Record<string, Record<CategoryId, string>>;
  groupName: string;
  startedAt: string;
}

export const StorageService = {
  // Players
  getPlayers(): Player[] {
    try {
      const data = localStorage.getItem(PLAYERS_KEY);
      if (!data) {
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(DEFAULT_PLAYERS));
        return DEFAULT_PLAYERS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PLAYERS;
    } catch {
      return DEFAULT_PLAYERS;
    }
  },

  savePlayer(player: Omit<Player, 'id' | 'createdAt'> & { id?: string }): Player {
    const players = this.getPlayers();
    if (player.id) {
      const index = players.findIndex((p) => p.id === player.id);
      if (index >= 0) {
        const updated: Player = {
          ...players[index],
          ...player,
        };
        players[index] = updated;
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
        return updated;
      }
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: player.name.trim(),
      color: player.color || '#4f46e5',
      createdAt: new Date().toISOString(),
      notes: player.notes?.trim(),
      groupTag: player.groupTag?.trim(),
    };

    players.push(newPlayer);
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    return newPlayer;
  },

  deletePlayer(playerId: string): void {
    const players = this.getPlayers().filter((p) => p.id !== playerId);
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  },

  // Matches
  getMatches(): MatchRecord[] {
    try {
      const data = localStorage.getItem(MATCHES_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveMatch(match: Omit<MatchRecord, 'id'> & { id?: string }): MatchRecord {
    const matches = this.getMatches();
    const newMatch: MatchRecord = {
      id: match.id || `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: match.date || new Date().toISOString(),
      groupName: match.groupName.trim() || 'Partita Veloce',
      playerResults: match.playerResults,
      notes: match.notes,
    };

    const existingIndex = matches.findIndex((m) => m.id === newMatch.id);
    if (existingIndex >= 0) {
      matches[existingIndex] = newMatch;
    } else {
      matches.unshift(newMatch); // newest first
    }

    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    return newMatch;
  },

  deleteMatch(matchId: string): void {
    const matches = this.getMatches().filter((m) => m.id !== matchId);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  },

  clearAllMatches(): void {
    localStorage.removeItem(MATCHES_KEY);
  },

  // Matches filtered by player or group
  getMatchesForPlayer(playerId: string): MatchRecord[] {
    return this.getMatches().filter((m) =>
      m.playerResults.some((res) => res.playerId === playerId)
    );
  },

  getMatchesForGroup(groupName: string): MatchRecord[] {
    return this.getMatches().filter(
      (m) => m.groupName.toLowerCase() === groupName.toLowerCase()
    );
  },

  getUniqueGroups(): string[] {
    const matches = this.getMatches();
    const groups = new Set<string>();
    matches.forEach((m) => {
      if (m.groupName) groups.add(m.groupName);
    });
    return Array.from(groups);
  },

  // Player Statistics
  getPlayerStats(playerId: string): PlayerStats | null {
    const player = this.getPlayers().find((p) => p.id === playerId);
    if (!player) return null;

    const matches = this.getMatchesForPlayer(playerId);
    const totalGames = matches.length;

    let wins = 0;
    let highScore = 0;
    let scoreSum = 0;
    let bonusCount = 0;
    let superYahtzeeCount = 0;
    const recentScores: number[] = [];

    matches.forEach((m) => {
      const pRes = m.playerResults.find((r) => r.playerId === playerId);
      if (!pRes) return;

      if (pRes.isWinner) wins++;
      if (pRes.grandTotal > highScore) highScore = pRes.grandTotal;
      scoreSum += pRes.grandTotal;
      if (pRes.upperBonus > 0) bonusCount++;
      if (pRes.scores['super_yahtzee'] === 75) superYahtzeeCount++;
      recentScores.push(pRes.grandTotal);
    });

    return {
      playerId,
      playerName: player.name,
      playerColor: player.color,
      totalGames,
      wins,
      winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
      highScore,
      averageScore: totalGames > 0 ? Math.round(scoreSum / totalGames) : 0,
      bonusCount,
      bonusRate: totalGames > 0 ? Math.round((bonusCount / totalGames) * 100) : 0,
      superYahtzeeCount,
      recentScores: recentScores.slice(0, 10),
    };
  },

  // Active game persistence
  getActiveGame(): ActiveGameState | null {
    try {
      const data = localStorage.getItem(ACTIVE_GAME_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveActiveGame(state: ActiveGameState): void {
    try {
      localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save active game', e);
    }
  },

  clearActiveGame(): void {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  },

  // Export / Import
  exportAllData(): string {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      players: this.getPlayers(),
      matches: this.getMatches(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.players)) {
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(parsed.players));
      }
      if (Array.isArray(parsed.matches)) {
        localStorage.setItem(MATCHES_KEY, JSON.stringify(parsed.matches));
      }
      return { success: true, message: 'Dati importati con successo!' };
    } catch {
      return { success: false, message: 'File JSON non valido o corrotto' };
    }
  },
};
