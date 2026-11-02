import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  playerName?: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  playerName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              Azzerare la Scheda?
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {playerName ? `Giocatore: ${playerName}` : 'Partita in corso'}
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Tutti i campi e i punteggi inseriti nella scheda corrente verranno cancellati con un click. Questa azione non può essere annullata.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Azzera Tutto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
