import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, AlertTriangle, BookOpen, Play, Check } from 'lucide-react';
import { SectionContent, SectionId, UserProgress } from '../types/physics';
import { SECTIONS_DATA, QUIZ_QUESTIONS } from '../data/curriculumData';
import { MagnetLab } from './simulators/MagnetLab';
import { CircuitEnergyLab } from './simulators/CircuitEnergyLab';
import { EarthMagnetismLab } from './simulators/EarthMagnetismLab';
import { OerstedLab } from './simulators/OerstedLab';
import { FieldCalculatorLab } from './simulators/FieldCalculatorLab';
import { QuizModule } from './quiz/QuizModule';

interface ModuleDetailViewProps {
  section: SectionContent;
  userProgress: UserProgress;
  onSelectSection: (id: SectionId) => void;
  onXpEarned: (xp: number, badgeNames: string[]) => void;
  onAnswerSubmitted: (progress: UserProgress, xpGained: number, newBadges: string[]) => void;
}

export const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({
  section,
  userProgress,
  onSelectSection,
  onXpEarned,
  onAnswerSubmitted,
}) => {
  const [activeSubView, setActiveSubView] = useState<'tudo' | 'simulador' | 'exercicios'>('tudo');

  // Find index of current section to allow prev/next navigation
  const currentIndex = SECTIONS_DATA.findIndex(s => s.id === section.id);
  const prevSection = currentIndex > 0 ? SECTIONS_DATA[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_DATA.length - 1 ? SECTIONS_DATA[currentIndex + 1] : null;

  // Compute section completion status
  const sectionQuestions = QUIZ_QUESTIONS.filter(q => q.sectionId === section.id);
  const correctCount = sectionQuestions.filter(q => userProgress.answeredQuestions[q.id]?.isCorrect).length;
  const isSectionMastered = sectionQuestions.length > 0 && correctCount === sectionQuestions.length;

  return (
    <div className="space-y-8">
      {/* Module Hero Header */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Módulo 0{section.number} de 06</span>
              <span className="text-slate-600">·</span>
              <span>Nível Iniciante</span>
              {isSectionMastered && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-sans font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {section.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {section.summary}
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-4 shrink-0 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">EXERCÍCIOS:</span>
              <span className="text-base font-bold text-white">
                {correctCount} / {sectionQuestions.length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-indigo-400">
              {Math.round((correctCount / sectionQuestions.length) * 100)}%
            </div>
          </div>
        </div>

        {/* View Filter segmented buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('tudo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubView === 'tudo' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800/70 text-slate-400 hover:text-white'
            }`}
          >
            Visão Geral Completa
          </button>
          <button
            onClick={() => setActiveSubView('simulador')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubView === 'simulador' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800/70 text-slate-400 hover:text-white'
            }`}
          >
            Simulador Interativo
          </button>
          <button
            onClick={() => setActiveSubView('exercicios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubView === 'exercicios' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800/70 text-slate-400 hover:text-white'
            }`}
          >
            Exercícios Práticos ({sectionQuestions.length})
          </button>
        </div>
      </div>

      {/* Warning Callout if present for this module */}
      {section.examWarning && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Dica Chave da Prova (06/10):</strong> {section.examWarning}
          </div>
        </div>
      )}

      {/* SIMULATOR COMPONENT FOR THIS SPECIFIC MODULE */}
      {(activeSubView === 'tudo' || activeSubView === 'simulador') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-400" />
              Simulador Visual Prático
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Manipule os parâmetros para assimilar os conceitos
            </span>
          </div>

          {section.simulationType === 'magnet-lab' && (
            <MagnetLab onXpEarned={onXpEarned} />
          )}

          {section.simulationType === 'circuit-lab' && (
            <CircuitEnergyLab onXpEarned={onXpEarned} />
          )}

          {section.simulationType === 'earth-lab' && (
            <EarthMagnetismLab onXpEarned={onXpEarned} />
          )}

          {section.simulationType === 'oersted-lab' && (
            <OerstedLab onXpEarned={onXpEarned} />
          )}

          {(section.simulationType === 'conductor-lab' || section.simulationType === 'formula-lab') && (
            <FieldCalculatorLab onXpEarned={onXpEarned} />
          )}
        </div>
      )}

      {/* KEY THEORETICAL POINTS (Clean Cards) */}
      {(activeSubView === 'tudo') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Conceitos Teóricos Explicados (Sem Complicação)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.keyPoints.map((pt, i) => (
              <div key={i} className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{pt.title}</h4>
                  {pt.tag && (
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                      {pt.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRACTICAL QUIZ SECTION */}
      {(activeSubView === 'tudo' || activeSubView === 'exercicios') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Exercícios Práticos do Módulo 0{section.number}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Feedback instantâneo e resolução comentada
            </span>
          </div>

          <QuizModule
            currentSectionId={section.id}
            userProgress={userProgress}
            onAnswerSubmitted={onAnswerSubmitted}
          />
        </div>
      )}

      {/* Next / Previous Module Navigation Bar */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
        {prevSection ? (
          <button
            onClick={() => {
              onSelectSection(prevSection.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Módulo Anterior: {prevSection.title.split(':')[0]}</span>
          </button>
        ) : <div />}

        {nextSection && (
          <button
            onClick={() => {
              onSelectSection(nextSection.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition shadow-sm ml-auto"
          >
            <span>Próximo Módulo: {nextSection.title.split(':')[0]}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
