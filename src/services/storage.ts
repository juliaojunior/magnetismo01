/**
 * Structured Database Storage Service for MagnaFísica
 * Implements IndexedDB with schema migration and localStorage fallback.
 * Validates user progress, computes levels, logs quiz submissions, and evaluates badges.
 */

import { Badge, LeaderboardEntry, SectionId, UserProgress } from '../types/physics';

const DB_NAME = 'MagnaFisicaDB_v1';
const DB_VERSION = 1;
const STORE_PROGRESS = 'user_progress';
const STORE_SUBMISSIONS = 'quiz_submissions';

const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Primeiro Eletroímã',
    description: 'Iniciou seus estudos e realizou o primeiro experimento com ímãs.',
    iconName: 'Sparkles',
    category: 'conceito',
    conditionDescription: 'Complete sua primeira interação em qualquer simulador.',
  },
  {
    id: 'badge-inseparable',
    title: 'Inseparabilidade dos Polos',
    description: 'Compreendeu que ao cortar um ímã surgem novos ímãs e monopolo é proibido!',
    iconName: 'Scissors',
    category: 'conceito',
    conditionDescription: 'Corte o ímã no Simulador de Ímãs.',
  },
  {
    id: 'badge-joule-master',
    title: 'Mestre do Efeito Joule',
    description: 'Diferenciou perfeitamente Resistor, Receptor e Gerador no circuito elétrico.',
    iconName: 'Flame',
    category: 'conceito',
    conditionDescription: 'Teste os 3 dispositivos no Simulador de Circuitos.',
  },
  {
    id: 'badge-polar-navigator',
    title: 'Navegador Geomagnético',
    description: 'Descobriu que o Polo Norte Geográfico abriga o Polo Sul Magnético da Terra.',
    iconName: 'Compass',
    category: 'conceito',
    conditionDescription: 'Arraste a bússola pelo globo no Simulador Terrestre.',
  },
  {
    id: 'badge-aurora-borealis',
    title: 'Caçador de Auroras',
    description: 'Simulou a colisão das partículas solares canalizadas pelas linhas de campo.',
    iconName: 'Sun',
    category: 'pratica',
    conditionDescription: 'Dispare a rajada solar no Simulador de Auroras.',
  },
  {
    id: 'badge-oersted-hero',
    title: 'Descobridor de Oersted (1820)',
    description: 'Provou experimentalmente que corrente elétrica gera campo magnético B.',
    iconName: 'Zap',
    category: 'pratica',
    conditionDescription: 'Ligue o circuito de Oersted e desvie a agulha.',
  },
  {
    id: 'badge-right-hand',
    title: 'Regra da Mão Direita nº 1',
    description: 'Dominou a convenção tridimensional ⊗ e ⊙ com o polegar na corrente elétrica.',
    iconName: 'Hand',
    category: 'pratica',
    conditionDescription: 'Acerte uma questão sobre a regra da mão direita.',
  },
  {
    id: 'badge-field-architect',
    title: 'Calculador de Campo B',
    description: 'Diferenciou as 4 fórmulas: fio reto (2πR), espira (2R), bobina (N/2R) e solenoide (N/L).',
    iconName: 'Calculator',
    category: 'mestre',
    conditionDescription: 'Calcule o campo de um condutor no Laboratório de Condutores.',
  },
  {
    id: 'badge-unit-converter',
    title: 'Zero Pegadinha da Prova',
    description: 'Converteu centímetros e milímetros para metros antes dos cálculos!',
    iconName: 'ShieldAlert',
    category: 'mestre',
    conditionDescription: 'Resolva um cálculo com conversão de unidades para a prova de 06/10.',
  },
  {
    id: 'badge-physics-ace',
    title: 'Gabaritador da Prova (06/10)',
    description: 'Alcançou mais de 80% de precisão geral em todos os módulos teóricos e práticos.',
    iconName: 'Award',
    category: 'mestre',
    conditionDescription: 'Conclua todos os tópicos e alcance 500 XP.',
  },
];

const INITIAL_PROGRESS: UserProgress = {
  userId: 'user_' + Math.random().toString(36).substring(2, 9),
  userName: 'Aluno(a) de Física',
  xp: 0,
  level: 1,
  levelTitle: 'Iniciante Curioso',
  completedSections: [],
  completedSimulations: [],
  answeredQuestions: {},
  unlockedBadgeIds: [],
  streakDays: 1,
  lastActiveTimestamp: Date.now(),
};

// Peer classmates for high school ranking simulation
const PEER_STUDENTS: Omit<LeaderboardEntry, 'rank'>[] = [
  { id: 'peer-1', name: 'Sofia Mendes', avatarSeed: 'sm', xp: 820, accuracy: 96, completedBadgesCount: 9 },
  { id: 'peer-2', name: 'Lucas Prado', avatarSeed: 'lp', xp: 710, accuracy: 92, completedBadgesCount: 8 },
  { id: 'peer-3', name: 'Beatriz Lima', avatarSeed: 'bl', xp: 640, accuracy: 89, completedBadgesCount: 7 },
  { id: 'peer-4', name: 'Gabriel Torres', avatarSeed: 'gt', xp: 520, accuracy: 85, completedBadgesCount: 6 },
  { id: 'peer-5', name: 'Mariana Costa', avatarSeed: 'mc', xp: 430, accuracy: 81, completedBadgesCount: 5 },
  { id: 'peer-6', name: 'Enzo Alencar', avatarSeed: 'ea', xp: 350, accuracy: 78, completedBadgesCount: 4 },
  { id: 'peer-7', name: 'Camila Rocha', avatarSeed: 'cr', xp: 260, accuracy: 74, completedBadgesCount: 3 },
  { id: 'peer-8', name: 'Thiago Farias', avatarSeed: 'tf', xp: 180, accuracy: 70, completedBadgesCount: 2 },
  { id: 'peer-9', name: 'Larissa Moura', avatarSeed: 'lm', xp: 90, accuracy: 65, completedBadgesCount: 1 },
];

class StorageEngine {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
            db.createObjectStore(STORE_PROGRESS, { keyPath: 'userId' });
          }
          if (!db.objectStoreNames.contains(STORE_SUBMISSIONS)) {
            db.createObjectStore(STORE_SUBMISSIONS, { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to LocalStorage');
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  public async getProgress(): Promise<UserProgress> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_PROGRESS, 'readonly');
          const store = tx.objectStore(STORE_PROGRESS);
          const req = store.getAll();

          req.onsuccess = () => {
            if (req.result && req.result.length > 0) {
              resolve(req.result[0] as UserProgress);
            } else {
              const fallback = this.getFromLocalStorage();
              this.saveProgress(fallback);
              resolve(fallback);
            }
          };

          req.onerror = () => {
            resolve(this.getFromLocalStorage());
          };
        } catch {
          resolve(this.getFromLocalStorage());
        }
      });
    }
    return this.getFromLocalStorage();
  }

  public async saveProgress(progress: UserProgress): Promise<void> {
    this.saveToLocalStorage(progress);
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_PROGRESS, 'readwrite');
        const store = tx.objectStore(STORE_PROGRESS);
        store.put(progress);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private getFromLocalStorage(): UserProgress {
    try {
      const data = localStorage.getItem('magna_fisica_progress');
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return { ...INITIAL_PROGRESS };
  }

  private saveToLocalStorage(progress: UserProgress): void {
    try {
      localStorage.setItem('magna_fisica_progress', JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }

  public calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; prevLevelXp: number } {
    if (xp < 100) {
      return { level: 1, title: 'Iniciante Curioso', nextLevelXp: 100, prevLevelXp: 0 };
    } else if (xp < 250) {
      return { level: 2, title: 'Explorador de Oersted', nextLevelXp: 250, prevLevelXp: 100 };
    } else if (xp < 450) {
      return { level: 3, title: 'Físico Experimental', nextLevelXp: 450, prevLevelXp: 250 };
    } else if (xp < 700) {
      return { level: 4, title: 'Engenheiro Eletromagnético', nextLevelXp: 700, prevLevelXp: 450 };
    } else {
      return { level: 5, title: 'Mestre do Eletromagnetismo', nextLevelXp: 1000, prevLevelXp: 700 };
    }
  }

  public getBadges(): Badge[] {
    return INITIAL_BADGES;
  }

  public async recordAnswer(
    questionId: string,
    sectionId: SectionId,
    selectedOption: number,
    isCorrect: boolean
  ): Promise<{ updatedProgress: UserProgress; newlyUnlockedBadges: Badge[]; xpGained: number }> {
    const current = await this.getProgress();
    const existing = current.answeredQuestions[questionId];
    const attempts = (existing?.attempts || 0) + 1;

    let xpGained = 0;
    if (isCorrect) {
      // First attempt correct = 30 XP, subsequent = 15 XP
      xpGained = attempts === 1 ? 30 : 15;
    } else {
      // Encouragement points for trying
      xpGained = attempts === 1 ? 5 : 0;
    }

    const updatedAnswers = {
      ...current.answeredQuestions,
      [questionId]: {
        selectedOption,
        isCorrect,
        timestamp: Date.now(),
        attempts,
      },
    };

    const newXp = current.xp + xpGained;
    const levelInfo = this.calculateLevel(newXp);

    // Check newly unlocked badges
    const currentBadgeIds = new Set(current.unlockedBadgeIds);
    const newlyUnlocked: Badge[] = [];

    // Rule: First step badge
    if (!currentBadgeIds.has('badge-first-step')) {
      currentBadgeIds.add('badge-first-step');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-first-step')!);
    }

    // Rule: Right hand rule question answered
    if (sectionId === 'oersted-mao-direita' && isCorrect && !currentBadgeIds.has('badge-right-hand')) {
      currentBadgeIds.add('badge-right-hand');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-right-hand')!);
    }

    // Rule: Unit converter badge
    if (sectionId === 'grandezas-constantes' && isCorrect && !currentBadgeIds.has('badge-unit-converter')) {
      currentBadgeIds.add('badge-unit-converter');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-unit-converter')!);
    }

    // Rule: Physics Ace badge (500 XP)
    if (newXp >= 500 && !currentBadgeIds.has('badge-physics-ace')) {
      currentBadgeIds.add('badge-physics-ace');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-physics-ace')!);
    }

    // Update completed sections if user has answered questions in this section
    const updatedSections = [...current.completedSections];
    if (!updatedSections.includes(sectionId)) {
      updatedSections.push(sectionId);
    }

    const updatedProgress: UserProgress = {
      ...current,
      xp: newXp,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      answeredQuestions: updatedAnswers,
      completedSections: updatedSections,
      unlockedBadgeIds: Array.from(currentBadgeIds),
      lastActiveTimestamp: Date.now(),
    };

    await this.saveProgress(updatedProgress);
    return { updatedProgress, newlyUnlockedBadges: newlyUnlocked, xpGained };
  }

  public async recordSimulationAction(
    simulationType: string,
    actionKey: string
  ): Promise<{ updatedProgress: UserProgress; newlyUnlockedBadges: Badge[]; xpGained: number }> {
    const current = await this.getProgress();
    const actionId = `${simulationType}:${actionKey}`;

    const alreadyDone = current.completedSimulations.includes(actionId);
    const xpGained = alreadyDone ? 0 : 25; // 25 XP for discovering a new physical phenomenon

    const currentBadgeIds = new Set(current.unlockedBadgeIds);
    const newlyUnlocked: Badge[] = [];

    // Check specific simulation badges
    if (!currentBadgeIds.has('badge-first-step')) {
      currentBadgeIds.add('badge-first-step');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-first-step')!);
    }

    if (actionId.includes('magnet-cut') && !currentBadgeIds.has('badge-inseparable')) {
      currentBadgeIds.add('badge-inseparable');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-inseparable')!);
    }

    if (actionId.includes('circuit-all-tested') && !currentBadgeIds.has('badge-joule-master')) {
      currentBadgeIds.add('badge-joule-master');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-joule-master')!);
    }

    if (actionId.includes('earth-compass-dragged') && !currentBadgeIds.has('badge-polar-navigator')) {
      currentBadgeIds.add('badge-polar-navigator');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-polar-navigator')!);
    }

    if (actionId.includes('solar-burst') && !currentBadgeIds.has('badge-aurora-borealis')) {
      currentBadgeIds.add('badge-aurora-borealis');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-aurora-borealis')!);
    }

    if (actionId.includes('oersted-switch-on') && !currentBadgeIds.has('badge-oersted-hero')) {
      currentBadgeIds.add('badge-oersted-hero');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-oersted-hero')!);
    }

    if (actionId.includes('conductor-calculated') && !currentBadgeIds.has('badge-field-architect')) {
      currentBadgeIds.add('badge-field-architect');
      newlyUnlocked.push(INITIAL_BADGES.find(b => b.id === 'badge-field-architect')!);
    }

    const updatedCompletedSims = alreadyDone 
      ? current.completedSimulations 
      : [...current.completedSimulations, actionId];

    const newXp = current.xp + xpGained;
    const levelInfo = this.calculateLevel(newXp);

    const updatedProgress: UserProgress = {
      ...current,
      xp: newXp,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      completedSimulations: updatedCompletedSims,
      unlockedBadgeIds: Array.from(currentBadgeIds),
      lastActiveTimestamp: Date.now(),
    };

    await this.saveProgress(updatedProgress);
    return { updatedProgress, newlyUnlockedBadges: newlyUnlocked, xpGained };
  }

  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const progress = await this.getProgress();
    const answeredCount = Object.keys(progress.answeredQuestions).length;
    const correctCount = Object.values(progress.answeredQuestions).filter(q => q.isCorrect).length;
    const userAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

    const currentUserEntry: LeaderboardEntry = {
      id: progress.userId,
      name: progress.userName || 'Você (Estudante)',
      avatarSeed: 'user',
      xp: progress.xp,
      accuracy: userAccuracy,
      completedBadgesCount: progress.unlockedBadgeIds.length,
      isCurrentUser: true,
    };

    const all = [...PEER_STUDENTS, currentUserEntry];
    all.sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy);

    return all.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  public async updateUserName(name: string): Promise<UserProgress> {
    const current = await this.getProgress();
    const updated = { ...current, userName: name.trim() || 'Aluno(a) de Física' };
    await this.saveProgress(updated);
    return updated;
  }

  public async resetProgress(): Promise<UserProgress> {
    const fresh: UserProgress = {
      ...INITIAL_PROGRESS,
      userId: 'user_' + Math.random().toString(36).substring(2, 9),
    };
    await this.saveProgress(fresh);
    return fresh;
  }
}

export const storageService = new StorageEngine();
