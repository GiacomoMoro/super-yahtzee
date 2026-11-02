import React, { useState, useEffect } from 'react';
import { CategoryDefinition } from '../types/game';
import { validateCategoryInput } from '../utils/validation';
import { AlertCircle, Check, X } from 'lucide-react';

interface ScoreInputCellProps {
  category: CategoryDefinition;
  value: string;
  onChange: (val: string) => void;
  onOpenDiceCalc?: () => void;
}

export const ScoreInputCell: React.FC<ScoreInputCellProps> = ({
  category,
  value,
  onChange,
  onOpenDiceCalc,
}) => {
  const [localVal, setLocalVal] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const validation = validateCategoryInput(category.id, localVal);
  const isInvalid = !validation.isValid;
  const isFilled = localVal.trim() !== '' && validation.isValid;
  const isZero = validation.parsedNumber === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);
    onChange(raw);
  };

  const setDirectValue = (num: number) => {
    const str = String(num);
    setLocalVal(str);
    onChange(str);
  };

  const handleClear = () => {
    setLocalVal('');
    onChange('');
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-[200px] ml-auto">
      {/* Input container */}
      <div className="relative flex items-center">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max={category.maxScore}
          value={localVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="-"
          aria-label={`Punteggio per ${category.col1Label}`}
          className={`w-full h-11 px-3 text-right font-mono text-base font-semibold rounded-lg transition-all border outline-none
            ${
              isInvalid
                ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-400 dark:bg-red-950/40 dark:border-red-600 dark:text-red-200'
                : isFilled
                ? isZero
                  ? 'border-stone-300 bg-stone-100 text-stone-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 line-through'
                  : 'border-emerald-400 bg-emerald-50/70 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-600 dark:text-emerald-200'
                : 'border-stone-300 bg-white text-stone-900 focus:border-stone-500 focus:ring-2 focus:ring-stone-400/30 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100'
            }
          `}
        />

        {/* Clear button if filled */}
        {localVal !== '' && (
          <button
            type="button"
            onClick={handleClear}
            title="Cancella valore"
            className="absolute left-2 text-stone-400 hover:text-stone-600 p-1 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Validation error notification banner */}
      {isInvalid && validation.errorMessage && (
        <div className="flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium leading-tight animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>{validation.errorMessage}</span>
        </div>
      )}

      {/* Quick click chips for fast mobile input */}
      <div className="flex flex-wrap items-center justify-end gap-1 pt-0.5">
        {/* Fixed categories quick buttons (0 or Fixed score) */}
        {category.isFixed && category.fixedScore !== undefined && (
          <>
            <button
              type="button"
              onClick={() => setDirectValue(0)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                localVal === '0'
                  ? 'bg-stone-700 text-white border-stone-700 dark:bg-stone-200 dark:text-stone-900'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
              }`}
            >
              0 (No)
            </button>
            <button
              type="button"
              onClick={() => setDirectValue(category.fixedScore!)}
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded border transition-colors ${
                localVal === String(category.fixedScore)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              }`}
            >
              +{category.fixedScore}
            </button>
          </>
        )}

        {/* Upper section quick multiplier dice buttons */}
        {category.section === 'upper' && category.diceNumber && (
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <button
              type="button"
              onClick={() => setDirectValue(0)}
              title="0 dadi"
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                localVal === '0'
                  ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400'
              }`}
            >
              0
            </button>
            {[1, 2, 3, 4, 5, 6].map((count) => {
              const scoreVal = count * category.diceNumber!;
              const isSelected = localVal === String(scoreVal);
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setDirectValue(scoreVal)}
                  title={`${count} dadi (${scoreVal} pt)`}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
                  }`}
                >
                  {count}×
                </button>
              );
            })}
          </div>
        )}

        {/* For sum categories (Poker, 5 of a kind, Chance) */}
        {!category.isFixed && category.section === 'lower' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDirectValue(0)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                localVal === '0'
                  ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400'
              }`}
            >
              0 (No)
            </button>
            {onOpenDiceCalc && (
              <button
                type="button"
                onClick={onOpenDiceCalc}
                className="px-2 py-0.5 text-[10px] rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200"
              >
                Somma 6 Dadi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
