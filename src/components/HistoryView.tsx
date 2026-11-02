import React, { useState } from 'react';
import { MatchRecord, Player } from '../types/game';
import { StorageService } from '../services/storage';
import { ALL_CATEGORIES } from '../utils/validation';
import {
  Trophy,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Trash2,
  Filter,
  CheckCircle,
  Award,
} from 'lucide-react';

interface HistoryViewProps {
  players: Player[];
  matches: MatchRecord[];
  onRefreshMatches: () => void;
  onSelectPlayerForNewGame?: (playerId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  players,
  matches,
  onRefreshMatches,
  onSelectPlayerForNewGame,
}) => {
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const uniqueGroups = StorageService.getUniqueGroups();

  // Filter matches based on selected player & group
  const filteredMatches = matches.filter((match) => {
    if (
      selectedPlayerFilter !== 'all' &&
      !match.playerResults.some((p) => p.playerId === selectedPlayerFilter)
    ) {
      return false;
    }
    if (
      selectedGroupFilter !== 'all' &&
      match.groupName.toLowerCase() !== selectedGroupFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  const handleDelete = (matchId: string) => {
    if (window.confirm('Vuoi davvero eliminare questa partita dalla cronologia?')) {
      StorageService.deleteMatch(matchId);
      onRefreshMatches();
    }
  };

  const toggleExpand = (matchId: string) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Cronologia Partite</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Visualizza le partite precedenti divise per singolo giocatore o gruppo
            </p>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Partite trovate: <strong className="text-stone-800 dark:text-stone-200">{filteredMatches.length}</strong>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          {/* Player Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Filtra per Giocatore
            </label>
            <select
              value={selectedPlayerFilter}
              onChange={(e) => setSelectedPlayerFilter(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">Tutti i Giocatori ({players.length})</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Filtra per Gruppo / Serata
            </label>
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">Tutti i Gruppi</option>
              {uniqueGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
            Nessuna partita trovata
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Completa e salva una partita dalla schermata Scheda per iniziare a costruire lo storico e le statistiche!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const isExpanded = expandedMatchId === match.id;
            const matchDate = new Date(match.date);
            const dateFormatted = matchDate.toLocaleDateString('it-IT', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            // Find winner
            const winner = match.playerResults.find((p) => p.isWinner) || match.playerResults[0];

            return (
              <div
                key={match.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-all"
              >
                {/* Match Header Bar */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {match.groupName}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500 font-mono">
                        {dateFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {match.playerResults.map((p) => p.playerName).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Winner / Top score pill */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-xl">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="text-right">
                        <span className="text-[10px] text-amber-800 dark:text-amber-300 block font-medium">
                          Vincitore: {winner?.playerName}
                        </span>
                        <span className="font-mono font-black text-xs text-amber-900 dark:text-amber-100">
                          {winner?.grandTotal} pt
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(match.id)}
                      className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title={isExpanded ? 'Comprimi' : 'Mostra dettagli'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(match.id)}
                      className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Elimina partita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Player Scores Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2.5 bg-stone-50 dark:bg-stone-950/40 border-t border-stone-100 dark:border-stone-800 text-xs">
                  {match.playerResults.map((p) => (
                    <div
                      key={p.playerId}
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.playerColor || '#0284c7' }}
                        />
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                          {p.playerName}
                        </span>
                      </div>
                      <div className="text-right pl-2">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {p.grandTotal} pt
                        </span>
                        {p.upperBonus > 0 && (
                          <span className="text-[10px] text-amber-600 font-mono block">
                            (+45 bonus)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-4 bg-white dark:bg-stone-900">
                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                      Dettaglio Caselle per Giocatore
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
                            <th className="py-1.5 pr-2">Categoria</th>
                            {match.playerResults.map((p) => (
                              <th
                                key={p.playerId}
                                className="py-1.5 px-2 text-right font-bold text-stone-700 dark:text-stone-300"
                              >
                                {p.playerName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-mono">
                          {ALL_CATEGORIES.map((cat) => (
                            <tr key={cat.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                              <td className="py-1.5 pr-2 font-sans text-stone-700 dark:text-stone-300">
                                {cat.col1Label}
                              </td>
                              {match.playerResults.map((p) => {
                                const score = p.scores[cat.id];
                                return (
                                  <td
                                    key={p.playerId}
                                    className={`py-1.5 px-2 text-right ${
                                      score === 0
                                        ? 'text-stone-400 line-through'
                                        : score !== null
                                        ? 'text-stone-900 dark:text-stone-100 font-semibold'
                                        : 'text-stone-300'
                                    }`}
                                  >
                                    {score !== null ? `${score} pt` : '-'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}

                          {/* Subtotale Superiore */}
                          <tr className="bg-stone-50 dark:bg-stone-800/40 font-semibold font-sans">
                            <td className="py-1.5 pr-2">Subtotale Superiore</td>
                            {match.playerResults.map((p) => (
                              <td key={p.playerId} className="py-1.5 px-2 text-right font-mono">
                                {p.upperSubtotal} pt
                              </td>
                            ))}
                          </tr>

                          {/* Bonus Superiore */}
                          <tr className="bg-amber-50/50 dark:bg-amber-950/20 font-semibold font-sans">
                            <td className="py-1.5 pr-2 text-amber-800 dark:text-amber-300">
                              Bonus Superiore (≥ 84)
                            </td>
                            {match.playerResults.map((p) => (
                              <td
                                key={p.playerId}
                                className="py-1.5 px-2 text-right font-mono text-amber-700 dark:text-amber-400"
                              >
                                {p.upperBonus > 0 ? `+${p.upperBonus} pt` : '0 pt'}
                              </td>
                            ))}
                          </tr>

                          {/* Subtotale Inferiore */}
                          <tr className="bg-stone-50 dark:bg-stone-800/40 font-semibold font-sans">
                            <td className="py-1.5 pr-2">Subtotale Inferiore</td>
                            {match.playerResults.map((p) => (
                              <td key={p.playerId} className="py-1.5 px-2 text-right font-mono">
                                {p.lowerSubtotal} pt
                              </td>
                            ))}
                          </tr>

                          {/* Totale Finale */}
                          <tr className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold font-sans">
                            <td className="py-2 pr-2">TOTALE COMPLESSIVO</td>
                            {match.playerResults.map((p) => (
                              <td
                                key={p.playerId}
                                className="py-2 px-2 text-right font-mono text-sm"
                              >
                                {p.grandTotal} pt
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
