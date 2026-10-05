import React from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { UserProgress } from '../types/physics';

interface TopBarProps {
  currentTab: 'conteudo' | 'simuladores' | 'exercicios' | 'revisao';
  onSelectTab: (tab: 'conteudo' | 'simuladores' | 'exercicios' | 'revisao') => void;
  userProgress: UserProgress;
  onOpenLeaderboard: () => void;
  onOpenBadges: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  userProgress,
  onOpenLeaderboard,
  onOpenBadges,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('conteudo');
          }}
          className="text-lg font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap"
        >
          MagnaFísica
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('conteudo')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'conteudo'
                ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-4 -mb-px'
                : 'text-slate-400 hover:text-white py-4'
            }`}
          >
            Módulos
          </button>
          <button
            onClick={() => onSelectTab('simuladores')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'simuladores'
                ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-4 -mb-px'
                : 'text-slate-400 hover:text-white py-4'
            }`}
          >
            Simuladores
          </button>
          <button
            onClick={() => onSelectTab('exercicios')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'exercicios'
                ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-4 -mb-px'
                : 'text-slate-400 hover:text-white py-4'
            }`}
          >
            Exercícios
          </button>
          <button
            onClick={() => onSelectTab('revisao')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'revisao'
                ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-4 -mb-px'
                : 'text-slate-400 hover:text-white py-4'
            }`}
          >
            Revisão da Prova
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* XP & Level Indicator */}
          <button
            onClick={onOpenBadges}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-amber-400 transition"
            title="Ver Medalhas e Conquistas"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{userProgress.xp} XP</span>
          </button>

          {/* Leaderboard CTA */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition whitespace-nowrap"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ranking</span>
          </button>
        </div>
      </div>
    </header>
  );
};
