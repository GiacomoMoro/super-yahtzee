import React from 'react';
import { CategoryDefinition, CategoryId } from '../types/game';
import { ScoreInputCell } from './ScoreInputCell';
import { ScorecardTotals, UPPER_BONUS_POINTS, UPPER_BONUS_THRESHOLD } from '../utils/validation';
import { Award, Flame, CheckCircle2 } from 'lucide-react';

interface ScorecardSectionProps {
  title: string;
  subtitle?: string;
  categories: CategoryDefinition[];
  scores: Record<CategoryId, string>;
  onScoreChange: (catId: CategoryId, val: string) => void;
  totals: ScorecardTotals;
  isUpperSection?: boolean;
  onOpenDiceCalc?: (catId: CategoryId) => void;
}

export const ScorecardSection: React.FC<ScorecardSectionProps> = ({
  title,
  subtitle,
  categories,
  scores,
  onScoreChange,
  totals,
  isUpperSection = false,
  onOpenDiceCalc,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-4 py-3 bg-stone-50/80 dark:bg-stone-950/50 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Subtotale
          </span>
          <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
            {isUpperSection ? totals.upperSubtotal : totals.lowerSubtotal} pt
          </div>
        </div>
      </div>

      {/* 3-Column Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-stone-100 dark:border-stone-800/80 bg-stone-100/50 dark:bg-stone-900/60 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
        <div className="col-span-4 sm:col-span-3">1. Categoria</div>
        <div className="col-span-4 sm:col-span-5">2. Modo di Calcolo</div>
        <div className="col-span-4 sm:col-span-4 text-right">3. Risultato</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
        {categories.map((cat) => {
          const val = scores[cat.id] ?? '';
          return (
            <div
              key={cat.id}
              className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
            >
              {/* Col 1: Label / Number */}
              <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                {cat.diceNumber ? (
                  <span className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 text-stone-800 dark:text-stone-200">
                    {cat.diceNumber}
                  </span>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs sm:text-sm block">
                    {cat.col1Label}
                  </span>
                </div>
              </div>

              {/* Col 2: Calculation method */}
              <div className="col-span-4 sm:col-span-5 pr-1">
                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-snug">
                  {cat.col2Description}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  {cat.col2Formula}
                </p>
              </div>

              {/* Col 3: Score input cell */}
              <div className="col-span-4 sm:col-span-4">
                <ScoreInputCell
                  category={cat}
                  value={val}
                  onChange={(newVal) => onScoreChange(cat.id, newVal)}
                  onOpenDiceCalc={onOpenDiceCalc ? () => onOpenDiceCalc(cat.id) : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Upper Section Bonus Row & Subtotals */}
      {isUpperSection && (
        <div className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 divide-y divide-stone-100 dark:divide-stone-800/80">
          {/* Subtotale Parziale */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center">
            <div className="col-span-8 font-semibold text-xs text-stone-700 dark:text-stone-300">
              Totale Parziale Sezione Superiore:
            </div>
            <div className="col-span-4 text-right font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
              {totals.upperSubtotal} pt
            </div>
          </div>

          {/* Bonus 45 pt se >= 84 */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
            <div className="col-span-8">
              <div className="flex items-center gap-1.5">
                <Award
                  className={`w-4 h-4 ${
                    totals.hasUpperBonus
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-400'
                  }`}
                />
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Bonus Superiore (≥ {UPPER_BONUS_THRESHOLD} pt):
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                  +{UPPER_BONUS_POINTS} pt
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {totals.hasUpperBonus ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" />
                    Obiettivo raggiunto! (+45 punti assegnati)
                  </span>
                ) : (
                  <span>
                    Attuale: {totals.upperSubtotal}/{UPPER_BONUS_THRESHOLD} (mancano{' '}
                    <strong>{totals.bonusGap}</strong> pt per sbloccare il bonus)
                  </span>
                )}
              </p>
            </div>
            <div className="col-span-4 text-right">
              <span
                className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg border ${
                  totals.hasUpperBonus
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
                    : 'bg-stone-100 text-stone-400 border-stone-200 dark:bg-stone-800 dark:text-stone-500 dark:border-stone-700'
                }`}
              >
                {totals.hasUpperBonus ? `+${UPPER_BONUS_POINTS}` : '0'} pt
              </span>
            </div>
          </div>

          {/* Totale Finale Sezione Superiore */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center bg-stone-100/70 dark:bg-stone-900/90">
            <div className="col-span-8 font-bold text-xs text-stone-900 dark:text-stone-100">
              Totale Sezione Superiore (con Bonus):
            </div>
            <div className="col-span-4 text-right font-mono font-black text-base text-stone-900 dark:text-stone-100">
              {totals.upperSubtotal + totals.upperBonus} pt
            </div>
          </div>
        </div>
      )}

      {/* Lower Section Footer */}
      {!isUpperSection && (
        <div className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/90 px-4 py-2.5 flex items-center justify-between">
          <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
            Totale Sezione Inferiore:
          </div>
          <div className="font-mono font-black text-base text-stone-900 dark:text-stone-100">
            {totals.lowerSubtotal} pt
          </div>
        </div>
      )}
    </div>
  );
};
