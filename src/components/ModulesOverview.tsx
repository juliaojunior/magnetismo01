import React from 'react';
import { ArrowRight, CheckCircle2, Play, BookOpen, Award, Sparkles, Trophy } from 'lucide-react';
import { SectionId, UserProgress } from '../types/physics';
import { SECTIONS_DATA, QUIZ_QUESTIONS } from '../data/curriculumData';
import { storageService } from '../services/storage';

interface ModulesOverviewProps {
  userProgress: UserProgress;
  onSelectSection: (id: SectionId) => void;
  onOpenLeaderboard: () => void;
  onOpenBadges: () => void;
}

export const ModulesOverview: React.FC<ModulesOverviewProps> = ({
  userProgress,
  onSelectSection,
  onOpenLeaderboard,
  onOpenBadges,
}) => {
  const levelInfo = storageService.calculateLevel(userProgress.xp);
  const totalQuestions = QUIZ_QUESTIONS.length;
  const correctCount = Object.values(userProgress.answeredQuestions).filter(q => q.isCorrect).length;
  const overallPercentage = Math.round((correctCount / totalQuestions) * 100);

  // Level progress percentage
  const xpInCurrentLevel = userProgress.xp - levelInfo.prevLevelXp;
  const xpNeededForLevel = levelInfo.nextLevelXp - levelInfo.prevLevelXp;
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / Math.max(1, xpNeededForLevel)) * 100));

  return (
    <div className="space-y-8">
      {/* Student Gamification Hero Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Info */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Física do Ensino Médio</span>
              <span className="text-slate-600">·</span>
              <span>Caderno de Revisão (Prova 06/10/2026)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Magnetismo & Campo Magnético Interativo
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Aprenda todos os itens do material através de experimentos visuais práticos, sem abstrações difíceis. Conquiste pontos de experiência (XP), dispute o topo do ranking da turma e garanta nota 10 na prova!
            </p>

            {/* Level & XP Progress bar */}
            <div className="pt-2 max-w-lg space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Nível {levelInfo.level}: {levelInfo.title}
                </span>
                <span className="text-slate-400">
                  {userProgress.xp} / {levelInfo.nextLevelXp} XP ({levelProgressPct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Quick Stats */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <button
              onClick={onOpenBadges}
              className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 rounded-xl text-left transition space-y-1"
            >
              <div className="flex items-center justify-between text-amber-400">
                <Award className="w-5 h-5" />
                <span className="text-xs font-mono">Badges</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {userProgress.unlockedBadgeIds.length} / 10
              </div>
              <div className="text-[10px] text-slate-400">Medalhas Ganhas</div>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 rounded-xl text-left transition space-y-1"
            >
              <div className="flex items-center justify-between text-indigo-400">
                <Trophy className="w-5 h-5" />
                <span className="text-xs font-mono">Ranking</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {correctCount} / {totalQuestions}
              </div>
              <div className="text-[10px] text-slate-400">Questões ({overallPercentage}%)</div>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Modular Learning Cards (Logical Progression) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Trilha Modular de Aprendizagem
            </h2>
            <p className="text-xs text-slate-400">
              Progresso estruturado do básico ao avançado com simuladores e exercícios dedicados
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400">
            6 Módulos Obrigatórios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS_DATA.map((section) => {
            const sectionQuestions = QUIZ_QUESTIONS.filter(q => q.sectionId === section.id);
            const answeredCount = sectionQuestions.filter(q => userProgress.answeredQuestions[q.id]?.isCorrect).length;
            const isCompleted = sectionQuestions.length > 0 && answeredCount === sectionQuestions.length;
            const completionPct = Math.round((answeredCount / sectionQuestions.length) * 100);

            return (
              <div
                key={section.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-lg group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      MÓDULO 0{section.number}
                    </span>
                    {isCompleted ? (
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Dominado
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {completionPct}% Concluído
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {section.subtitle}
                    </p>
                  </div>

                  {/* Key points tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {section.keyPoints.slice(0, 3).map((kp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-950/60 text-slate-300 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {kp.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {answeredCount} / {sectionQuestions.length} questões
                  </div>

                  <button
                    onClick={() => onSelectSection(section.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition"
                  >
                    <span>Estudar Módulo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
