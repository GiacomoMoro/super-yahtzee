import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Regole Ufficiali Super Yahtzee
              </h3>
              <p className="text-xs text-stone-500">Versione a 6 dadi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-600 dark:text-stone-300">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-3.5 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
              Caratteristiche Principali
            </h4>
            <p className="text-amber-800/90 dark:text-amber-300/90">
              Si gioca con <strong>6 dadi</strong> e un massimo di 3 lanci per turno. Si può segnare 0 (barrare la casella) in qualsiasi categoria se non si ottiene la combinazione desiderata.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-2 border-b border-stone-100 dark:border-stone-800 pb-1">
              Sezione Superiore (Numeri da 1 a 6)
            </h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>1 (Uno):</strong> Somma degli 1 ottenuti (valori consentiti: 0, 1, 2, 3, 4, 5, 6).</li>
              <li><strong>2 (Due):</strong> Somma dei 2 ottenuti (solo numeri pari, max 12: 0, 2, 4, 6, 8, 10, 12).</li>
              <li><strong>3 (Tre):</strong> Somma dei 3 ottenuti (multipli di 3, max 18: 0, 3, 6, 9, 12, 15, 18).</li>
              <li><strong>4 (Quattro):</strong> Somma dei 4 ottenuti (multipli di 4, max 24: 0, 4, 8, 12, 16, 20, 24).</li>
              <li><strong>5 (Cinque):</strong> Somma dei 5 ottenuti (multipli di 5, max 30: 0, 5, 10, 15, 20, 25, 30).</li>
              <li><strong>6 (Sei):</strong> Somma dei 6 ottenuti (multipli di 6, max 36: 0, 6, 12, 18, 24, 30, 36).</li>
              <li className="pt-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                ★ <strong>BONUS SUPERIORE:</strong> Se il totale parziale della sezione superiore raggiunge o supera <strong>84 punti</strong> (media di 14 punti a casella), sblocchi <strong>45 punti bonus</strong>!
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-2 border-b border-stone-100 dark:border-stone-800 pb-1">
              Sezione Inferiore (Combinazioni Speciali)
            </h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>Poker:</strong> Almeno 4 dadi con lo stesso valore. Punteggio: <em>Somma di tutti i 6 dadi</em>.</li>
              <li><strong>5 of a Kind:</strong> Almeno 5 dadi con lo stesso valore. Punteggio: <em>Somma di tutti i 6 dadi</em>.</li>
              <li><strong>Full:</strong> 4 dadi uguali + 2 dadi uguali (es. 4-4-4-4-2-2) oppure 3 dadi uguali + 3 dadi uguali (es. 5-5-5-1-1-1). Punteggio fisso: <strong>25 punti</strong>.</li>
              <li><strong>3 Coppie:</strong> 3 coppie diverse di dadi (es. 2-2, 4-4, 6-6). Punteggio fisso: <strong>35 punti</strong>.</li>
              <li><strong>Scala Piccola:</strong> 4 dadi in sequenza numerica (es. 1-2-3-4, 2-3-4-5 o 3-4-5-6). Punteggio fisso: <strong>30 punti</strong>.</li>
              <li><strong>Scala Grande:</strong> 5 dadi in sequenza numerica (es. 1-2-3-4-5 o 2-3-4-5-6). Punteggio fisso: <strong>40 punti</strong>.</li>
              <li><strong>Scala Completa:</strong> Tutti i 6 dadi in sequenza (1-2-3-4-5-6). Punteggio fisso: <strong>50 punti</strong>.</li>
              <li><strong>Chance:</strong> Qualsiasi combinazione. Punteggio: <em>Somma di tutti i 6 dadi</em> (minimo 6, massimo 36).</li>
              <li><strong>Super Yahtzee:</strong> Tutti e 6 i dadi con lo stesso identico valore. Punteggio fisso: <strong>75 punti</strong>!</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-medium text-xs rounded-xl hover:bg-stone-800 dark:bg-white dark:text-stone-900"
          >
            Ho capito
          </button>
        </div>
      </div>
    </div>
  );
};
