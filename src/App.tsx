/**
 * MagnaFísica - Plataforma Interativa e Gamificada de Física do Ensino Médio
 * Magnetismo & Campo Magnético (Prova 06/10/2026)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, Trophy, Sparkles, BookOpen, RotateCcw, Check, ChevronRight } from 'lucide-react';
import { SectionId, UserProgress } from './types/physics';
import { SECTIONS_DATA } from './data/curriculumData';
import { storageService } from './services/storage';
import { TopBar } from './components/TopBar';
import { ModulesOverview } from './components/ModulesOverview';
import { ModuleDetailView } from './components/ModuleDetailView';
import { SimulatorsHub } from './components/SimulatorsHub';
import { QuizModule } from './components/quiz/QuizModule';
import { SummaryExamSheet } from './components/SummaryExamSheet';
import { LeaderboardModal } from './components/gamification/LeaderboardModal';
import { BadgesModal } from './components/gamification/BadgesModal';

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentTab, setCurrentTab] = useState<'conteudo' | 'simuladores' | 'exercicios' | 'revisao'>('conteudo');
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId | null>(null);

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);

  // Toast notifications for gamification
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; type: 'xp' | 'badge' } | null>(null);

  // Load progress from structured IndexedDB on mount
  useEffect(() => {
    storageService.getProgress().then(setUserProgress);
  }, []);

  const showGamificationToast = (title: string, subtitle: string, type: 'xp' | 'badge') => {
    setToastMessage({ title, subtitle, type });
    if (type === 'badge') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.2 },
        });
      } catch {
        // Safe fallback
      }
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleXpEarned = (xp: number, badgeNames: string[]) => {
    storageService.getProgress().then((updated) => {
      setUserProgress(updated);
      if (badgeNames.length > 0) {
        showGamificationToast(
          `🎉 Nova Medalha: ${badgeNames[0]}!`,
          `Você ganhou +${xp} XP no laboratório!`,
          'badge'
        );
      } else if (xp > 0) {
        showGamificationToast(
          `+${xp} XP Conquistado!`,
          'Excelente exploração experimental!',
          'xp'
        );
      }
    });
  };

  const handleAnswerSubmitted = (
    progress: UserProgress,
    xpGained: number,
    newBadges: string[]
  ) => {
    setUserProgress(progress);
    if (newBadges.length > 0) {
      showGamificationToast(
        `🏆 Medalha Desbloqueada: ${newBadges[0]}!`,
        `Parabéns! +${xpGained} XP adicionado ao seu ranking.`,
        'badge'
      );
    } else if (xpGained > 0) {
      showGamificationToast(
        `+${xpGained} XP Ganho!`,
        'Resposta computada com sucesso.',
        'xp'
      );
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm('Deseja reiniciar seu progresso e pontuação para começar um novo estudo do zero?')) {
      const fresh = await storageService.resetProgress();
      setUserProgress(fresh);
      setSelectedSectionId(null);
      showGamificationToast('Progresso Reiniciado', 'Todos os dados foram resetados para novo treino.', 'xp');
    }
  };

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3 font-mono text-sm">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Carregando banco de dados de física...</p>
        </div>
      </div>
    );
  }

  const selectedSection = selectedSectionId
    ? SECTIONS_DATA.find(s => s.id === selectedSectionId) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'conteudo') {
            setSelectedSectionId(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userProgress={userProgress}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
      />

      {/* Floating Gamification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-20 left-1/2 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 min-w-[280px] max-w-md ${
              toastMessage.type === 'badge'
                ? 'bg-amber-950/90 border-amber-500/80 text-amber-200'
                : 'bg-indigo-950/90 border-indigo-500/80 text-indigo-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
              {toastMessage.type === 'badge' ? (
                <Award className="w-4 h-4 text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{toastMessage.title}</div>
              <div className="text-[11px] opacity-90">{toastMessage.subtitle}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: CONTEÚDO MODULAR */}
        {currentTab === 'conteudo' && (
          <>
            {selectedSection ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedSectionId(null)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  <span>← Voltar à Lista dos 6 Módulos</span>
                </button>
                <ModuleDetailView
                  section={selectedSection}
                  userProgress={userProgress}
                  onSelectSection={(id) => setSelectedSectionId(id)}
                  onXpEarned={handleXpEarned}
                  onAnswerSubmitted={handleAnswerSubmitted}
                />
              </div>
            ) : (
              <ModulesOverview
                userProgress={userProgress}
                onSelectSection={(id) => {
                  setSelectedSectionId(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                onOpenBadges={() => setIsBadgesOpen(true)}
              />
            )}
          </>
        )}

        {/* TAB 2: SIMULADORES VIRTUAIS */}
        {currentTab === 'simuladores' && (
          <SimulatorsHub onXpEarned={handleXpEarned} />
        )}

        {/* TAB 3: EXERCÍCIOS PRÁTICOS COMPLETOS */}
        {currentTab === 'exercicios' && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                Banco Completo de Exercícios Práticos
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Treinamento Intensivo para Iniciantes
              </h2>
              <p className="text-xs text-slate-400">
                Responda a cada questão para validar o progresso na base de dados e subir no ranking da turma.
              </p>
            </div>
            <QuizModule
              userProgress={userProgress}
              onAnswerSubmitted={handleAnswerSubmitted}
            />
          </div>
        )}

        {/* TAB 4: REVISÃO COMPLETA PARA A PROVA */}
        {currentTab === 'revisao' && (
          <SummaryExamSheet />
        )}
      </main>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userProgress={userProgress}
        onNameUpdated={(updated) => setUserProgress(updated)}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        userProgress={userProgress}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">MagnaFísica</span>
            <span>·</span>
            <span>Caderno de Revisão: Física Fundamental & Eletrodinâmica</span>
            <span>·</span>
            <span className="text-indigo-400 font-mono">Prova: 06/10/2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetProgress}
              className="text-slate-500 hover:text-rose-400 transition flex items-center gap-1"
              title="Resetar banco de dados local"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Progresso</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
