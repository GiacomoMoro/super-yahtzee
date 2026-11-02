import React, { useState } from 'react';
import { Player, PlayerStats } from '../types/game';
import { StorageService } from '../services/storage';
import {
  Users,
  UserPlus,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
} from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  onRefreshPlayers: () => void;
  onSelectPlayerForGame: (playerId: string) => void;
}

const COLOR_OPTIONS = [
  '#0284c7', // Sky
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Red
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#475569', // Slate
  '#0d9488', // Teal
];

export const PlayersView: React.FC<PlayersViewProps> = ({
  players,
  onRefreshPlayers,
  onSelectPlayerForGame,
}) => {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [groupTag, setGroupTag] = useState('');
  const [notes, setNotes] = useState('');

  // Selected player for deep stats inspection
  const [activePlayerId, setActivePlayerId] = useState<string>(
    players[0]?.id || ''
  );

  const stats = activePlayerId
    ? StorageService.getPlayerStats(activePlayerId)
    : null;

  const handleOpenAdd = () => {
    setIsAddingPlayer(true);
    setEditingPlayerId(null);
    setName('');
    setColor(COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)]);
    setGroupTag('');
    setNotes('');
  };

  const handleOpenEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setIsAddingPlayer(true);
    setName(player.name);
    setColor(player.color);
    setGroupTag(player.groupTag || '');
    setNotes(player.notes || '');
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    StorageService.savePlayer({
      id: editingPlayerId || undefined,
      name,
      color,
      groupTag: groupTag.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setIsAddingPlayer(false);
    setEditingPlayerId(null);
    onRefreshPlayers();
  };

  const handleDeletePlayer = (playerId: string) => {
    if (players.length <= 1) {
      alert('Devi mantenere almeno un giocatore nel database locale.');
      return;
    }
    if (window.confirm('Eliminare questo profilo giocatore? Le partite già registrate rimarranno nella cronologia.')) {
      StorageService.deletePlayer(playerId);
      if (activePlayerId === playerId) {
        setActivePlayerId(players.find((p) => p.id !== playerId)?.id || '');
      }
      onRefreshPlayers();
    }
  };

  const handleExportData = () => {
    const json = StorageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `super-yahtzee-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importData(content);
      alert(res.message);
      if (res.success) {
        onRefreshPlayers();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Database Giocatori & Statistiche</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Profili salvati in locale, record personali e percentuali di vittoria
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            title="Esporta backup JSON"
            className="px-3 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup</span>
          </button>

          <label
            title="Importa backup JSON"
            className="px-3 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importa</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:bg-stone-800 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuovo Giocatore</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal or Inline Box */}
      {isAddingPlayer && (
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {editingPlayerId ? 'Modifica Giocatore' : 'Aggiungi Nuovo Giocatore'}
            </h3>
            <button
              onClick={() => setIsAddingPlayer(false)}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSavePlayer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nome o Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Marco, Anna..."
                  className="w-full h-10 px-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Gruppo / Etichetta (opzionale)
                </label>
                <input
                  type="text"
                  value={groupTag}
                  onChange={(e) => setGroupTag(e.target.value)}
                  placeholder="Es. Casa, Colleghi, Amici Giovedì..."
                  className="w-full h-10 px-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Colore Profilo
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsAddingPlayer(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-colors"
              >
                Salva Giocatore
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players List Tabs / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Player Selector list */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block px-1">
            Profili Giocatori ({players.length})
          </span>
          <div className="space-y-1.5">
            {players.map((p) => {
              const isActive = activePlayerId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePlayerId(p.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 shadow-sm'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {p.name}
                      </h4>
                      {p.groupTag && (
                        <span className="text-[10px] text-stone-400 block truncate">
                          {p.groupTag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(p);
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                      title="Modifica"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlayer(p.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Player Deep Stats Dashboard */}
        <div className="md:col-span-2">
          {stats ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-5 shadow-sm">
              {/* Profile Card Header */}
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md"
                    style={{ backgroundColor: stats.playerColor }}
                  >
                    {stats.playerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                      {stats.playerName}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Statistiche carriera Super Yahtzee
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlayerForGame(stats.playerId)}
                  className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-colors"
                >
                  Gioca con {stats.playerName}
                </button>
              </div>

              {/* KPI Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Partite Giocate */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Partite
                  </span>
                  <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                    {stats.totalGames}
                  </div>
                  <span className="text-[11px] text-stone-500">registrate</span>
                </div>

                {/* Vittorie & Winrate */}
                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 tracking-wider block flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Vittorie
                  </span>
                  <div className="font-mono text-2xl font-black text-amber-900 dark:text-amber-100 mt-1">
                    {stats.wins}
                  </div>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80 font-medium">
                    {stats.winRate}% win rate
                  </span>
                </div>

                {/* Punteggio Record */}
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider block flex items-center gap-1">
                    <Award className="w-3 h-3" /> Record
                  </span>
                  <div className="font-mono text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">
                    {stats.highScore}
                  </div>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-medium">
                    punti massimi
                  </span>
                </div>

                {/* Media Punteggio */}
                <div className="p-3.5 bg-sky-50/60 dark:bg-sky-950/30 rounded-xl border border-sky-200/50 dark:border-sky-800/40">
                  <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 tracking-wider block">
                    Media Punti
                  </span>
                  <div className="font-mono text-2xl font-black text-sky-950 dark:text-sky-100 mt-1">
                    {stats.averageScore}
                  </div>
                  <span className="text-[11px] text-sky-700/80 dark:text-sky-300/80 font-medium">
                    per partita
                  </span>
                </div>
              </div>

              {/* Special Achievements Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Bonus Superiore (≥ 84) */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-stone-100">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Bonus Superiore (≥84 pt)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Sbloccato in {stats.bonusCount} su {stats.totalGames} partite
                    </p>
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.bonusRate}%
                  </div>
                </div>

                {/* Super Yahtzee (75 pt) */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-stone-100">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span>Super Yahtzee Realizzati</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      6 dadi uguali (75 pt)
                    </p>
                  </div>
                  <div className="font-mono text-xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.superYahtzeeCount}
                  </div>
                </div>
              </div>

              {/* Recent scores trend */}
              {stats.recentScores.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Punteggi Recenti
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {stats.recentScores.map((sc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 font-mono text-xs font-bold text-stone-800 dark:text-stone-200"
                      >
                        {sc} pt
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 text-center text-stone-400 text-xs">
              Seleziona un giocatore per visualizzare le statistiche
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
