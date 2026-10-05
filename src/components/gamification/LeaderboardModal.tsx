import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, User, X, Check, Edit2 } from 'lucide-react';
import { LeaderboardEntry, UserProgress } from '../../types/physics';
import { storageService } from '../../services/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onNameUpdated: (newProgress: UserProgress) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onNameUpdated,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProgress.userName);

  useEffect(() => {
    if (isOpen) {
      storageService.getLeaderboard().then(setEntries);
      setTempName(userProgress.userName);
    }
  }, [isOpen, userProgress]);

  if (!isOpen) return null;

  const handleSaveName = async () => {
    if (!tempName.trim()) return;
    const updated = await storageService.updateUserName(tempName.trim());
    onNameUpdated(updated);
    setIsEditingName(false);
    const refreshed = await storageService.getLeaderboard();
    setEntries(refreshed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Ranking de Desempenho Escolar
              </h3>
              <p className="text-xs text-slate-400">
                Classificação da Turma de Física (Eletromagnetismo & 3º Ano EM)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Quick Bar & Editable Name */}
        <div className="p-4 bg-indigo-950/40 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              {userProgress.userName.charAt(0).toUpperCase()}
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  maxLength={24}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition"
                  title="Salvar Nome"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{userProgress.userName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-indigo-400 transition"
                  title="Alterar seu nome"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">PONTUAÇÃO:</span>
              <strong className="text-amber-400">{userProgress.xp} XP</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">NÍVEL:</span>
              <strong className="text-indigo-300">Nv. {userProgress.level}</strong>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {entries.map((entry) => {
            const isMe = entry.isCurrentUser;
            const rank = entry.rank || 1;

            return (
              <div
                key={entry.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                  isMe
                    ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-7 text-center font-mono font-bold text-sm">
                    {rank === 1 ? (
                      <span className="text-amber-400 text-base">🥇</span>
                    ) : rank === 2 ? (
                      <span className="text-slate-300 text-base">🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-amber-600 text-base">🥉</span>
                    ) : (
                      <span className="text-slate-500">#{rank}</span>
                    )}
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isMe ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {entry.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {entry.name}
                      {isMe && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                          (Você)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>Precisão: {entry.accuracy}%</span>
                      <span>·</span>
                      <span>{entry.completedBadgesCount} badges</span>
                    </div>
                  </div>
                </div>

                {/* Right: XP Score */}
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-amber-400 tabular-nums">
                    {entry.xp}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
          Resolva exercícios práticos e complete experimentos nos laboratórios para subir no ranking!
        </div>
      </div>
    </div>
  );
};
