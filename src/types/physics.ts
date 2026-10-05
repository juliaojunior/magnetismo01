/**
 * Type definitions for MagnaFísica interactive physics learning platform
 * Based on the High School Physics Summary: Magnetismo & Campo Magnético (Prova 06/10/2026)
 */

export type SectionId = 
  | 'propriedades-imas'
  | 'circuitos-energia'
  | 'terra-auroras'
  | 'oersted-mao-direita'
  | 'calculo-condutores'
  | 'grandezas-constantes';

export interface QuizQuestion {
  id: string;
  sectionId: SectionId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  examTip?: string;
  difficulty: 'iniciante' | 'intermediario';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'conceito' | 'pratica' | 'mestre';
  requiredXp?: number;
  conditionDescription: string;
}

export interface UserProgress {
  userId: string;
  userName: string;
  xp: number;
  level: number;
  levelTitle: string;
  completedSections: SectionId[];
  completedSimulations: string[];
  answeredQuestions: Record<string, {
    selectedOption: number;
    isCorrect: boolean;
    timestamp: number;
    attempts: number;
  }>;
  unlockedBadgeIds: string[];
  streakDays: number;
  lastActiveTimestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarSeed: string;
  xp: number;
  accuracy: number;
  completedBadgesCount: number;
  isCurrentUser?: boolean;
  rank?: number;
}

export interface SectionContent {
  id: SectionId;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: {
    title: string;
    description: string;
    tag?: string;
  }[];
  simulationType: 'magnet-lab' | 'circuit-lab' | 'earth-lab' | 'oersted-lab' | 'conductor-lab' | 'formula-lab';
  examWarning?: string;
}
