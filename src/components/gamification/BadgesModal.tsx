import React from 'react';
import { Award, CheckCircle, Lock, X, Sparkles, Scissors, Flame, Compass, Sun, Zap, Hand, Calculator, ShieldAlert } from 'lucide-react';
import { Badge, UserProgress } from '../../types/physics';
import { storageService } from '../../services/storage';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Scissors: <Scissors className="w-5 h-5 text-indigo-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
  Compass: <Compass className="w-5 h-5 text-sky-400" />,
  Sun: <Sun className="w-5 h-5 text-yellow-400" />,
  Zap: <Zap className="w-5 h-5 text-emerald-400" />,
  Hand: <Hand className="w-5 h-5 text-purple-400" />,
  Calculator: <Calculator className="w-5 h-5 text-cyan-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  Award: <Award className="w-5 h-5 text-amber-400" />,
};

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  userProgress,
}) => {
  if (!isOpen) return null;

  const allBadges: Badge[] = storageService.getBadges();
  const unlockedSet = new Set(userProgress.unlockedBadgeIds);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Galeria de Conquistas & Medalhas
              </h3>
              <p className="text-xs text-slate-400">
                {unlockedSet.size} de {allBadges.length} medalhas conquistadas ({Math.round((unlockedSet.size / allBadges.length) * 100)}%)
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

        {/* Progress Bar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${(unlockedSet.size / allBadges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
          {allBadges.map((badge) => {
            const isUnlocked = unlockedSet.has(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-indigo-500/50 shadow-sm'
                    : 'bg-slate-950/30 border-slate-800/80 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUnlocked
                    ? 'bg-slate-900 border-indigo-500/40 shadow-inner'
                    : 'bg-slate-900 border-slate-800'
                }`}>
                  {isUnlocked ? (
                    ICON_MAP[badge.iconName] || <Award className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                    {isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {badge.description}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    <span className="text-indigo-400">Como obter:</span> {badge.conditionDescription}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
