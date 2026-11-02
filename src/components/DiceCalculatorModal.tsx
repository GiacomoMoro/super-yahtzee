import React, { useState } from 'react';
import { X, Dices, CheckCircle2 } from 'lucide-react';
import { CategoryId } from '../types/game';

interface DiceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCategory?: CategoryId | null;
  onApplyScore: (categoryId: CategoryId, score: number) => void;
}

export const DiceCalculatorModal: React.FC<DiceCalculatorModalProps> = ({
  isOpen,
  onClose,
  targetCategory,
  onApplyScore,
}) => {
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1, 1, 1]);

  if (!isOpen) return null;

  const totalSum = dice.reduce((acc, curr) => acc + curr, 0);

  const setDie = (index: number, val: number) => {
    const updated = [...dice];
    updated[index] = val;
    setDice(updated);
  };

  // Helper detection of Super Yahtzee combinations
  const counts: Record<number, number> = {};
  dice.forEach((d) => {
    counts[d] = (counts[d] || 0) + 1;
  });
  const countValues = Object.values(counts).sort((a, b) => b - a);

  const isYahtzee = countValues[0] === 6;
  const isFiveOfKind = countValues[0] >= 5;
  const isPoker = countValues[0] >= 4;
  const isFull =
    (countValues[0] === 4 && countValues[1] === 2) ||
    (countValues[0] === 3 && countValues[1] === 3);
  const isThreePairs =
    countValues[0] === 2 && countValues[1] === 2 && countValues[2] === 2;

  // Straights check
  const uniqueSorted = Array.from(new Set(dice)).sort((a, b) => a - b);
  const checkConsecutive = (arr: number[], length: number) => {
    let maxLen = 1;
    let currentLen = 1;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1] === arr[i] + 1) {
        currentLen++;
        maxLen = Math.max(maxLen, currentLen);
      } else {
        currentLen = 1;
      }
    }
    return maxLen >= length;
  };

  const isFullStraight = checkConsecutive(uniqueSorted, 6);
  const isLargeStraight = checkConsecutive(uniqueSorted, 5);
  const isSmallStraight = checkConsecutive(uniqueSorted, 4);

  const handleApply = (catId: CategoryId, score: number) => {
    onApplyScore(catId, score);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                Calcolatore 6 Dadi Fisici
              </h3>
              <p className="text-xs text-stone-500">
                Imposta i dadi per calcolare la somma e verificare le combinazioni
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Dice Selectors */}
        <div className="grid grid-cols-6 gap-2">
          {dice.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono text-stone-400">Dado {idx + 1}</span>
              <div className="w-full aspect-square flex items-center justify-center text-xl font-bold font-mono bg-stone-50 border border-stone-300 dark:bg-stone-800 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 shadow-sm">
                {val}
              </div>
              <div className="grid grid-cols-2 gap-1 w-full">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDie(idx, num)}
                    className={`py-0.5 text-xs font-mono rounded transition-colors ${
                      val === num
                        ? 'bg-amber-500 text-white font-bold'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dice Total Banner */}
        <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
            Somma totale di tutti i 6 dadi:
          </span>
          <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalSum} pt
          </span>
        </div>

        {/* Detected Hand combinations */}
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
            Combinazioni Rilevate:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {isYahtzee && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold rounded-md">
                Super Yahtzee (75 pt)
              </span>
            )}
            {isFullStraight && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded-md">
                Scala Completa (50 pt)
              </span>
            )}
            {isLargeStraight && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded-md">
                Scala Grande (40 pt)
              </span>
            )}
            {isSmallStraight && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded-md">
                Scala Piccola (30 pt)
              </span>
            )}
            {isThreePairs && (
              <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-semibold rounded-md">
                3 Coppie (35 pt)
              </span>
            )}
            {isFull && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold rounded-md">
                Full (25 pt)
              </span>
            )}
            {isFiveOfKind && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold rounded-md">
                5 of a Kind ({totalSum} pt)
              </span>
            )}
            {isPoker && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold rounded-md">
                Poker ({totalSum} pt)
              </span>
            )}
          </div>
        </div>

        {/* Quick Apply CTA */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          {targetCategory && (
            <button
              type="button"
              onClick={() => {
                const scoreToApply =
                  targetCategory === 'chance' ||
                  targetCategory === 'poker' ||
                  targetCategory === 'five_of_a_kind'
                    ? totalSum
                    : targetCategory === 'super_yahtzee' && isYahtzee
                    ? 75
                    : targetCategory === 'full_straight' && isFullStraight
                    ? 50
                    : targetCategory === 'large_straight' && isLargeStraight
                    ? 40
                    : targetCategory === 'small_straight' && isSmallStraight
                    ? 30
                    : targetCategory === 'three_pairs' && isThreePairs
                    ? 35
                    : targetCategory === 'full' && isFull
                    ? 25
                    : totalSum;
                handleApply(targetCategory, scoreToApply);
              }}
              className="px-4 py-2 bg-stone-900 text-white font-medium text-xs rounded-xl hover:bg-stone-800 dark:bg-white dark:text-stone-900"
            >
              Applica {totalSum} pt alla Casella
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
