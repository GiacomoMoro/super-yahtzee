import React from 'react';
import { Dices, Moon, Sun, Plus, RotateCcw, BookOpen } from 'lucide-react';

export type ActiveTab = 'scorecard' | 'history' | 'players';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenRules: () => void;
  onResetGame: () => void;
  onNewGame: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenRules,
  onResetGame,
  onNewGame,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Dices className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
            SUPER YAHTZEE
          </span>
        </div>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            type="button"
            onClick={() => onTabChange('scorecard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'scorecard'
                ? 'text-stone-950 dark:text-white font-bold border-b-2 border-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Scheda Segnapunti
          </button>
          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'history'
                ? 'text-stone-950 dark:text-white font-bold border-b-2 border-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Cronologia Partite
          </button>
          <button
            type="button"
            onClick={() => onTabChange('players')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'players'
                ? 'text-stone-950 dark:text-white font-bold border-b-2 border-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Giocatori & Stats
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Regole 6 Dadi</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
            className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onNewGame}
            className="px-3.5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuova Partita</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav Row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-950/70 text-xs font-semibold">
        <button
          type="button"
          onClick={() => onTabChange('scorecard')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'scorecard'
              ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Scheda
        </button>
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Cronologia
        </button>
        <button
          type="button"
          onClick={() => onTabChange('players')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'players'
              ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Giocatori
        </button>
        <button
          type="button"
          onClick={onOpenRules}
          className="px-2.5 py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900"
        >
          Regole
        </button>
      </div>
    </header>
  );
};
