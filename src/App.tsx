/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CategoryId,
  MatchPlayerResult,
  MatchRecord,
  Player,
} from './types/game';
import {
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  calculateTotals,
  createEmptyScorecard,
  UPPER_BONUS_THRESHOLD,
  UPPER_BONUS_POINTS,
  validateCategoryInput,
} from './utils/validation';
import { StorageService, ActiveGameState } from './services/storage';
import { Header, ActiveTab } from './components/Header';
import { ScorecardSection } from './components/ScorecardSection';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { DiceCalculatorModal } from './components/DiceCalculatorModal';
import { RulesModal } from './components/RulesModal';
import { HistoryView } from './components/HistoryView';
import { PlayersView } from './components/PlayersView';
import {
  RotateCcw,
  Save,
  Trophy,
  UserPlus,
  Users,
  Dices,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('scorecard');

  // Theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('sy_theme') === 'dark' ||
      (!('sy_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sy_theme', 'light');
    }
  }, [isDark]);

  // Database State
  const [players, setPlayers] = useState<Player[]>(() => StorageService.getPlayers());
  const [matches, setMatches] = useState<MatchRecord[]>(() => StorageService.getMatches());

  // Active Game State
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(() => {
    const active = StorageService.getActiveGame();
    if (active && active.selectedPlayerIds.length > 0) {
      return active.selectedPlayerIds;
    }
    const all = StorageService.getPlayers();
    return [all[0]?.id || 'player-1'];
  });

  const [currentPlayerId, setCurrentPlayerId] = useState<string>(() => {
    const active = StorageService.getActiveGame();
    if (active && active.currentPlayerId) {
      return active.currentPlayerId;
    }
    const all = StorageService.getPlayers();
    return all[0]?.id || 'player-1';
  });

  const [scoresByPlayer, setScoresByPlayer] = useState<
    Record<string, Record<CategoryId, string>>
  >(() => {
    const active = StorageService.getActiveGame();
    if (active && active.scoresByPlayer) {
      return active.scoresByPlayer;
    }
    const initial: Record<string, Record<CategoryId, string>> = {};
    const all = StorageService.getPlayers();
    all.forEach((p) => {
      initial[p.id] = createEmptyScorecard();
    });
    return initial;
  });

  const [groupName, setGroupName] = useState<string>(() => {
    const active = StorageService.getActiveGame();
    return active?.groupName || 'Partita Veloce';
  });

  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDiceCalcOpen, setIsDiceCalcOpen] = useState(false);
  const [diceCalcCategory, setDiceCalcCategory] = useState<CategoryId | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSaveSuccessToast, setIsSaveSuccessToast] = useState(false);

  // Sync active game to storage
  useEffect(() => {
    const gameState: ActiveGameState = {
      selectedPlayerIds,
      currentPlayerId,
      scoresByPlayer,
      groupName,
      startedAt: new Date().toISOString(),
    };
    StorageService.saveActiveGame(gameState);
  }, [selectedPlayerIds, currentPlayerId, scoresByPlayer, groupName]);

  // Active player object
  const currentPlayer = useMemo(() => {
    return players.find((p) => p.id === currentPlayerId) || players[0];
  }, [players, currentPlayerId]);

  // Active player scores
  const currentScores = useMemo(() => {
    return scoresByPlayer[currentPlayerId] || createEmptyScorecard();
  }, [scoresByPlayer, currentPlayerId]);

  // Active player calculated totals
  const currentTotals = useMemo(() => {
    return calculateTotals(currentScores);
  }, [currentScores]);

  // Handle score change for current player
  const handleScoreChange = (catId: CategoryId, val: string) => {
    setScoresByPlayer((prev) => {
      const pScores = { ...(prev[currentPlayerId] || createEmptyScorecard()) };
      pScores[catId] = val;
      return {
        ...prev,
        [currentPlayerId]: pScores,
      };
    });

    // If player enters 75 on super_yahtzee, trigger celebratory confetti!
    if (catId === 'super_yahtzee' && val.trim() === '75') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }
    }
  };

  // One-click reset for current player (or all players in game)
  const handleConfirmReset = () => {
    setScoresByPlayer((prev) => ({
      ...prev,
      [currentPlayerId]: createEmptyScorecard(),
    }));
  };

  // Start brand new game with clean sheets
  const handleStartNewGame = () => {
    if (
      window.confirm(
        'Vuoi avviare una nuova partita azzerando tutti i punteggi correnti?'
      )
    ) {
      const resetScores: Record<string, Record<CategoryId, string>> = {};
      selectedPlayerIds.forEach((pid) => {
        resetScores[pid] = createEmptyScorecard();
      });
      setScoresByPlayer(resetScores);
      StorageService.clearActiveGame();
      setActiveTab('scorecard');
    }
  };

  // Save current match into local database history
  const handleSaveMatch = () => {
    if (currentTotals.hasAnyInvalid) {
      alert('Impossibile salvare la partita: correggi i valori non consentiti segnalati in rosso!');
      return;
    }

    // Determine results for each selected player
    const playerResults: MatchPlayerResult[] = selectedPlayerIds.map((pid) => {
      const playerObj = players.find((p) => p.id === pid) || {
        id: pid,
        name: 'Giocatore',
        color: '#0284c7',
      };
      const pScores = scoresByPlayer[pid] || createEmptyScorecard();
      const pTotals = calculateTotals(pScores);

      const parsedScoresRecord = {} as Record<CategoryId, number | null>;
      Object.entries(pScores).forEach(([k, v]) => {
        const valRes = validateCategoryInput(k as CategoryId, v);
        parsedScoresRecord[k as CategoryId] = valRes.parsedNumber;
      });

      return {
        playerId: pid,
        playerName: playerObj.name,
        playerColor: playerObj.color,
        scores: parsedScoresRecord,
        upperSubtotal: pTotals.upperSubtotal,
        upperBonus: pTotals.upperBonus,
        lowerSubtotal: pTotals.lowerSubtotal,
        grandTotal: pTotals.grandTotal,
        isWinner: false,
      };
    });

    // Mark winner(s)
    let maxScore = -1;
    playerResults.forEach((p) => {
      if (p.grandTotal > maxScore) maxScore = p.grandTotal;
    });
    playerResults.forEach((p) => {
      if (p.grandTotal === maxScore && maxScore > 0) {
        p.isWinner = true;
      }
    });

    const saved = StorageService.saveMatch({
      date: new Date().toISOString(),
      groupName: groupName.trim() || 'Partita Super Yahtzee',
      playerResults,
    });

    setMatches(StorageService.getMatches());
    setIsSaveSuccessToast(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // safe
    }

    setTimeout(() => {
      setIsSaveSuccessToast(false);
    }, 3500);
  };

  // Multi-player management in active match
  const handleTogglePlayerInMatch = (pid: string) => {
    if (selectedPlayerIds.includes(pid)) {
      if (selectedPlayerIds.length === 1) {
        alert('La partita deve includere almeno 1 giocatore.');
        return;
      }
      setSelectedPlayerIds(selectedPlayerIds.filter((id) => id !== pid));
      if (currentPlayerId === pid) {
        const remaining = selectedPlayerIds.filter((id) => id !== pid);
        setCurrentPlayerId(remaining[0]);
      }
    } else {
      setSelectedPlayerIds([...selectedPlayerIds, pid]);
      if (!scoresByPlayer[pid]) {
        setScoresByPlayer((prev) => ({
          ...prev,
          [pid]: createEmptyScorecard(),
        }));
      }
    }
  };

  const handleOpenDiceCalc = (catId?: CategoryId) => {
    setDiceCalcCategory(catId || null);
    setIsDiceCalcOpen(true);
  };

  const handleApplyDiceScore = (catId: CategoryId, score: number) => {
    handleScoreChange(catId, String(score));
  };

  const refreshAllData = () => {
    setPlayers(StorageService.getPlayers());
    setMatches(StorageService.getMatches());
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onResetGame={() => setIsResetModalOpen(true)}
        onNewGame={handleStartNewGame}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6">
        {/* VIEW 1: SCORECARD (SCHEDA SEGNAPUNTI) */}
        {activeTab === 'scorecard' && (
          <div className="space-y-6">
            {/* Top Match Bar: Players Selector & Quick Group Name */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      Scheda Partita Attiva
                    </h2>
                    <p className="text-xs text-stone-500">
                      Tocca un giocatore per visualizzare o inserire i punteggi
                    </p>
                  </div>
                </div>

                {/* Group / Event input */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                    Evento:
                  </span>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Es. Sfida Venerdì con Marco"
                    className="h-9 px-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 font-medium outline-none focus:ring-2 focus:ring-amber-500 max-w-[220px]"
                  />
                </div>
              </div>

              {/* Player switcher tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                {players.map((p) => {
                  const isInGame = selectedPlayerIds.includes(p.id);
                  const isCurrent = currentPlayerId === p.id;
                  const pScores = scoresByPlayer[p.id] || createEmptyScorecard();
                  const pTotals = calculateTotals(pScores);

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (!isInGame) {
                          handleTogglePlayerInMatch(p.id);
                        }
                        setCurrentPlayerId(p.id);
                      }}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border cursor-pointer transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : isInGame
                          ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-amber-400'
                          : 'bg-stone-50 dark:bg-stone-900/40 text-stone-400 border-dashed border-stone-300 dark:border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: isCurrent ? '#ffffff' : p.color,
                        }}
                      />
                      <span className="text-xs font-bold whitespace-nowrap">
                        {p.name}
                      </span>
                      {isInGame && (
                        <span
                          className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-100'
                          }`}
                        >
                          {pTotals.grandTotal} pt
                        </span>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveTab('players')}
                  className="px-3 py-2 text-xs font-medium border border-dashed border-stone-300 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 rounded-xl flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuovo Profilo</span>
                </button>
              </div>
            </div>

            {/* REAL-TIME TOTALS BANNER (Aggiornamento in tempo reale) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Sezione Superiore Subtotale */}
              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Sezione Superiore
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                    {currentTotals.upperSubtotal}
                  </span>
                  <span className="text-xs text-stone-500">pt</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Obiettivo Bonus:</span>
                  <span className="font-mono font-semibold">
                    {currentTotals.upperSubtotal} / {UPPER_BONUS_THRESHOLD}
                  </span>
                </div>
              </div>

              {/* Bonus Superiore */}
              <div
                className={`p-4 rounded-2xl border shadow-sm transition-all ${
                  currentTotals.hasUpperBonus
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Bonus Superiore (≥84)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-extrabold tabular-nums ${
                      currentTotals.hasUpperBonus
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-stone-400'
                    }`}
                  >
                    +{currentTotals.upperBonus}
                  </span>
                  <span className="text-xs text-stone-500">pt</span>
                </div>
                <div className="mt-2 text-[11px]">
                  {currentTotals.hasUpperBonus ? (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 inline" /> Sbloccato (+45 pt)!
                    </span>
                  ) : (
                    <span className="text-stone-500">
                      Mancano {currentTotals.bonusGap} pt al bonus
                    </span>
                  )}
                </div>
              </div>

              {/* Sezione Inferiore Subtotale */}
              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Sezione Inferiore
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tabular-nums">
                    {currentTotals.lowerSubtotal}
                  </span>
                  <span className="text-xs text-stone-500">pt</span>
                </div>
                <div className="mt-2 text-[11px] text-stone-500">
                  9 combinazioni speciali
                </div>
              </div>

              {/* Totale Complessivo Partita */}
              <div className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 p-4 rounded-2xl shadow-md border border-stone-800 dark:border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 dark:text-amber-600 block">
                  TOTALE COMPLESSIVO
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-3xl sm:text-4xl font-black tabular-nums">
                    {currentTotals.grandTotal}
                  </span>
                  <span className="text-xs opacity-75">punti</span>
                </div>
                <div className="mt-2 text-[11px] opacity-80 flex items-center justify-between">
                  <span>{currentPlayer?.name}</span>
                  <span>{currentTotals.filledCount}/15 caselle</span>
                </div>
              </div>
            </div>

            {/* Notification / Toast when saved */}
            {isSaveSuccessToast && (
              <div className="p-3.5 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Partita salvata con successo nella cronologia!</span>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-2.5 py-1 bg-white text-emerald-800 font-bold text-xs rounded-lg hover:bg-emerald-50"
                >
                  Vedi Cronologia
                </button>
              </div>
            )}

            {/* SCORECARD TABLES: UPPER SECTION & LOWER SECTION */}
            <div className="grid grid-cols-1 gap-6">
              {/* 1. SEZIONE SUPERIORE (Numeri da 1 a 6 con validazione rigorosa e bonus 84 -> +45) */}
              <ScorecardSection
                title="Sezione Superiore (Numeri 1 - 6)"
                subtitle="Inserisci il totale dei dadi per ogni numero. Valori vietati verranno bloccati automaticamente."
                categories={UPPER_CATEGORIES}
                scores={currentScores}
                onScoreChange={handleScoreChange}
                totals={currentTotals}
                isUpperSection={true}
              />

              {/* 2. SEZIONE INFERIORE (Combinazioni speciali con 3 colonne) */}
              <ScorecardSection
                title="Sezione Inferiore (Combinazioni Speciali)"
                subtitle="Poker, 5 of a Kind, Full, 3 Coppie, Scale, Chance e Super Yahtzee (75 pt)."
                categories={LOWER_CATEGORIES}
                scores={currentScores}
                onScoreChange={handleScoreChange}
                totals={currentTotals}
                isUpperSection={false}
                onOpenDiceCalc={handleOpenDiceCalc}
              />
            </div>

            {/* BOTTOM ACTIONS BAR: RESET CON 1 CLICK & SALVA PARTITA */}
            <div className="sticky bottom-4 z-30 p-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Reset button requested by user */}
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/40 rounded-xl transition-all flex items-center gap-1.5"
                  title="Azzera tutti i campi inseriti con un click"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Azzera Scheda</span>
                </button>

                {/* Dice calculator shortcut */}
                <button
                  type="button"
                  onClick={() => handleOpenDiceCalc()}
                  className="hidden sm:flex px-3.5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors items-center gap-1.5"
                >
                  <Dices className="w-4 h-4 text-amber-500" />
                  <span>Calcola 6 Dadi</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveMatch}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Salva Partita</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HISTORY (CRONOLOGIA PARTITE PER GIOCATORE / GRUPPO) */}
        {activeTab === 'history' && (
          <HistoryView
            players={players}
            matches={matches}
            onRefreshMatches={refreshAllData}
            onSelectPlayerForNewGame={(pid) => {
              setCurrentPlayerId(pid);
              if (!selectedPlayerIds.includes(pid)) {
                setSelectedPlayerIds([...selectedPlayerIds, pid]);
              }
              setActiveTab('scorecard');
            }}
          />
        )}

        {/* VIEW 3: PLAYERS & STATS (DATABASE LOCALE PROFILI E STATISTICHE) */}
        {activeTab === 'players' && (
          <PlayersView
            players={players}
            onRefreshPlayers={refreshAllData}
            onSelectPlayerForGame={(pid) => {
              setCurrentPlayerId(pid);
              if (!selectedPlayerIds.includes(pid)) {
                setSelectedPlayerIds([...selectedPlayerIds, pid]);
              }
              setActiveTab('scorecard');
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Super Yahtzee Segnapunti · Calcolo automatico in tempo reale con validazione
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="hover:underline"
            >
              Regole Ufficiali (6 Dadi)
            </button>
            <span>·</span>
            <span>Salvataggio Locale nel Browser</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        playerName={currentPlayer?.name}
      />

      <DiceCalculatorModal
        isOpen={isDiceCalcOpen}
        onClose={() => setIsDiceCalcOpen(false)}
        targetCategory={diceCalcCategory}
        onApplyScore={handleApplyDiceScore}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
