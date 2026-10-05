import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Lightbulb, HelpCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { QuizQuestion, SectionId, UserProgress } from '../../types/physics';
import { QUIZ_QUESTIONS, SECTIONS_DATA } from '../../data/curriculumData';
import { storageService } from '../../services/storage';

interface QuizModuleProps {
  currentSectionId?: SectionId;
  userProgress: UserProgress;
  onAnswerSubmitted: (progress: UserProgress, xpGained: number, newBadges: string[]) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  currentSectionId,
  userProgress,
  onAnswerSubmitted,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<SectionId | 'todos'>(currentSectionId || 'todos');
  const [showHintFor, setShowHintFor] = useState<Record<string, boolean>>({});

  // Filter questions
  const filteredQuestions = selectedFilter === 'todos'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.sectionId === selectedFilter);

  const handleSelectOption = async (question: QuizQuestion, optionIndex: number) => {
    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      // Trigger joyful gamified confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // Fallback
      }
    }

    const { updatedProgress, newlyUnlockedBadges, xpGained } = await storageService.recordAnswer(
      question.id,
      question.sectionId,
      optionIndex,
      isCorrect
    );

    onAnswerSubmitted(
      updatedProgress,
      xpGained,
      newlyUnlockedBadges.map(b => b.title)
    );
  };

  const toggleHint = (questionId: string) => {
    setShowHintFor(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <div className="space-y-6">
      {/* Section Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-2">Filtrar por Módulo:</span>
        <button
          onClick={() => setSelectedFilter('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            selectedFilter === 'todos'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todos os 6 Módulos ({QUIZ_QUESTIONS.length})
        </button>

        {SECTIONS_DATA.map((section) => {
          const sectionQuestions = QUIZ_QUESTIONS.filter(q => q.sectionId === section.id);
          const answeredCount = sectionQuestions.filter(q => userProgress.answeredQuestions[q.id]?.isCorrect).length;
          const isDone = answeredCount === sectionQuestions.length;

          return (
            <button
              key={section.id}
              onClick={() => setSelectedFilter(section.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedFilter === section.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{section.number}. {section.title.split(':')[0]}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.map((q, idx) => {
          const record = userProgress.answeredQuestions[q.id];
          const hasAnswered = record !== undefined;
          const isCorrect = record?.isCorrect ?? false;
          const selectedOption = record?.selectedOption;
          const sectionMeta = SECTIONS_DATA.find(s => s.id === q.sectionId);

          return (
            <div
              key={q.id}
              className={`p-6 rounded-xl border transition-all ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : 'bg-slate-900/90 border-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-400 font-semibold">
                    Questão {idx + 1}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    Módulo {sectionMeta?.number}: {sectionMeta?.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasAnswered && (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1 ${
                      isCorrect 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correto (+{record.attempts === 1 ? '30' : '15'} XP)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Tente novamente!
                        </>
                      )}
                    </span>
                  )}

                  <button
                    onClick={() => toggleHint(q.id)}
                    className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                    title="Ver dica do professor"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Prompt */}
              <h4 className="text-base font-semibold text-white mb-4 leading-relaxed">
                {q.question}
              </h4>

              {/* Optional Hint Box */}
              {showHintFor[q.id] && (
                <div className="mb-4 p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Dica Pedagógica:</strong> {q.hint}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  let buttonStyle = 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300';

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-semibold shadow-sm';
                    } else if (optIdx === selectedOption && !isCorrect) {
                      buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      buttonStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered && isCorrect}
                      onClick={() => handleSelectOption(q, optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs leading-normal transition flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center justify-center font-mono text-[11px] font-bold text-slate-400 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && optIdx === selectedOption && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Feedback Callout */}
              {hasAnswered && (
                <div className={`mt-4 p-4 rounded-lg text-xs leading-relaxed space-y-1.5 ${
                  isCorrect 
                    ? 'bg-emerald-950/30 border border-emerald-500/20 text-emerald-200' 
                    : 'bg-rose-950/30 border border-rose-500/20 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {isCorrect ? '✅ Resolução Comentada:' : '❌ O que você precisa lembrar:'}
                  </div>
                  <p>{q.explanation}</p>
                  {q.examTip && (
                    <div className="pt-1.5 text-amber-300 font-medium">
                      💡 <strong>Dica da Prova (06/10):</strong> {q.examTip}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
