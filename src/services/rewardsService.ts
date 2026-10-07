import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  QuizQuestion,
  QuizAttempt,
  Voucher,
  RewardProfile,
  MysteryBoxClaim
} from '../types';
import { INITIAL_QUIZ_QUESTIONS } from '../data/seedData';

const QUIZ_QUESTIONS_COL = 'quizQuestions';
const QUIZ_ATTEMPTS_COL = 'quizAttempts';
const VOUCHERS_COL = 'vouchers';
const REWARD_PROFILES_COL = 'rewardProfiles';
const MYSTERY_BOXES_COL = 'mysteryBoxes';

const LOCAL_VOUCHERS_KEY = 'samias_closet_vouchers_v1';
const LOCAL_ATTEMPTS_KEY = 'samias_closet_quiz_attempts_v1';
const LOCAL_MBOX_KEY = 'samias_closet_mystery_boxes_v1';
const LOCAL_PROFILES_KEY = 'samias_closet_reward_profiles_v1';

function getLocalVouchers(): Voucher[] {
  try {
    const raw = localStorage.getItem(LOCAL_VOUCHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalVouchers(list: Voucher[]): void {
  try {
    localStorage.setItem(LOCAL_VOUCHERS_KEY, JSON.stringify(list));
  } catch {}
}

function getLocalAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAttempts(list: QuizAttempt[]): void {
  try {
    localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(list));
  } catch {}
}

function getLocalMBoxes(): MysteryBoxClaim[] {
  try {
    const raw = localStorage.getItem(LOCAL_MBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMBoxes(list: MysteryBoxClaim[]): void {
  try {
    localStorage.setItem(LOCAL_MBOX_KEY, JSON.stringify(list));
  } catch {}
}

export function getCurrentWeekIdentifier(): string {
  const d = new Date();
  const year = d.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export const rewardsService = {
  // --- QUIZ SYSTEM ---

  async seedQuizQuestions(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, QUIZ_QUESTIONS_COL));
      if (!snap.empty) return;
      for (const q of INITIAL_QUIZ_QUESTIONS) {
        await setDoc(doc(db, QUIZ_QUESTIONS_COL, q.id), q);
      }
    } catch {}
  },

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    try {
      const snap = await getDocs(collection(db, QUIZ_QUESTIONS_COL));
      if (snap.empty) {
        return INITIAL_QUIZ_QUESTIONS;
      }
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuizQuestion, 'id'>) }));
    } catch {
      return INITIAL_QUIZ_QUESTIONS;
    }
  },

  async saveQuizQuestion(q: Omit<QuizQuestion, 'id'>, existingId?: string): Promise<string> {
    const id = existingId || `quiz-q-${Date.now()}`;
    const questionData: QuizQuestion = {
      ...q,
      id,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, QUIZ_QUESTIONS_COL, id), questionData);
    } catch (err) {
      console.warn('Could not save quiz question to Firestore:', err);
    }
    return id;
  },

  async hasAttemptedToday(customerId: string): Promise<boolean> {
    const today = getTodayDateString();

    // Check local attempts first
    const local = getLocalAttempts();
    if (local.some((a) => a.customerId === customerId && a.dateStr === today)) {
      return true;
    }

    try {
      const q = query(
        collection(db, QUIZ_ATTEMPTS_COL),
        where('customerId', '==', customerId),
        where('dateStr', '==', today)
      );
      const snap = await getDocs(q);
      return !snap.empty;
    } catch {
      return false;
    }
  },

  async getNextQuestionForCustomer(customerId: string): Promise<QuizQuestion | null> {
    const allQuestions = await this.getAllQuizQuestions();
    const activeQuestions = allQuestions.filter((q) => q.active);

    // Get answered IDs from local + firestore
    const local = getLocalAttempts().filter((a) => a.customerId === customerId);
    const answeredIds = new Set(local.map((a) => a.questionId));

    try {
      const historyQ = query(
        collection(db, QUIZ_ATTEMPTS_COL),
        where('customerId', '==', customerId)
      );
      const historySnap = await getDocs(historyQ);
      historySnap.docs.forEach((d) => answeredIds.add(d.data().questionId));
    } catch {}

    const unAnswered = activeQuestions.filter((q) => !answeredIds.has(q.id));
    if (unAnswered.length === 0) return null;

    return unAnswered[0];
  },

  async submitQuizAnswer(
    customerId: string,
    question: QuizQuestion,
    selectedAnswer: number
  ): Promise<{ isCorrect: boolean; rewardAmount: number; voucherId?: string }> {
    const today = getTodayDateString();
    const already = await this.hasAttemptedToday(customerId);
    if (already) {
      throw new Error('You have already taken your daily quiz for today. Come back tomorrow!');
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const rewardAmount = isCorrect ? 2 : 0;
    const attemptId = `attempt-${customerId}-${Date.now()}`;

    const attemptData: QuizAttempt = {
      id: attemptId,
      customerId,
      questionId: question.id,
      selectedAnswer,
      isCorrect,
      rewardAmount,
      createdAt: new Date().toISOString(),
      dateStr: today
    };

    // Save locally
    const attempts = getLocalAttempts();
    saveLocalAttempts([attemptData, ...attempts]);

    let voucherId: string | undefined;

    if (isCorrect) {
      voucherId = `vouch-quiz-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const voucherData: Voucher = {
        id: voucherId,
        customerId,
        amount: 2,
        source: 'quiz',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 0,
        maxUsage: 3,
        status: 'active'
      };

      const vouchers = getLocalVouchers();
      saveLocalVouchers([voucherData, ...vouchers]);

      // Attempt background Firestore write
      setDoc(doc(db, VOUCHERS_COL, voucherId), voucherData).catch(() => {});
    }

    // Attempt background Firestore write for attempt
    setDoc(doc(db, QUIZ_ATTEMPTS_COL, attemptId), attemptData).catch(() => {});

    return { isCorrect, rewardAmount, voucherId };
  },

  // --- MYSTERY BOX SYSTEM ---

  async canClaimMysteryBox(customerId: string): Promise<{ canClaim: boolean; currentWeek: string }> {
    const currentWeek = getCurrentWeekIdentifier();

    const localClaims = getLocalMBoxes();
    if (localClaims.some((c) => c.customerId === customerId && c.weekIdentifier === currentWeek)) {
      return { canClaim: false, currentWeek };
    }

    try {
      const q = query(
        collection(db, MYSTERY_BOXES_COL),
        where('customerId', '==', customerId),
        where('weekIdentifier', '==', currentWeek)
      );
      const snap = await getDocs(q);
      return { canClaim: snap.empty, currentWeek };
    } catch {
      return { canClaim: true, currentWeek };
    }
  },

  async claimMysteryBox(customerId: string): Promise<{ wonAmount: number; voucherId: string }> {
    const { canClaim, currentWeek } = await this.canClaimMysteryBox(customerId);
    if (!canClaim) {
      throw new Error(`You have already opened your Mystery Box for this week (${currentWeek}).`);
    }

    const rand = Math.random() * 100;
    let wonAmount = 2;
    if (rand < 0.5) wonAmount = 80;
    else if (rand < 1.0) wonAmount = 70;
    else if (rand < 1.8) wonAmount = 40;
    else if (rand < 3.0) wonAmount = 20;
    else if (rand < 23.0) {
      wonAmount = Math.floor(10 + Math.random() * 6);
    } else if (rand < 55.0) {
      wonAmount = Math.floor(5 + Math.random() * 5);
    } else {
      wonAmount = Math.floor(1 + Math.random() * 4);
    }

    const boxId = `mbox-${customerId}-${Date.now()}`;
    const voucherId = `vouch-mbox-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const isHighValue = wonAmount >= 20;
    const maxUsage = isHighValue ? 1 : 3;

    const claimData: MysteryBoxClaim = {
      id: boxId,
      customerId,
      wonAmount,
      weekIdentifier: currentWeek,
      createdAt: new Date().toISOString()
    };

    const voucherData: Voucher = {
      id: voucherId,
      customerId,
      amount: wonAmount,
      source: 'mystery_box',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 0,
      maxUsage,
      status: 'active'
    };

    // Save locally
    const claims = getLocalMBoxes();
    saveLocalMBoxes([claimData, ...claims]);

    const vouchers = getLocalVouchers();
    saveLocalVouchers([voucherData, ...vouchers]);

    // Firestore attempt in background
    setDoc(doc(db, MYSTERY_BOXES_COL, boxId), claimData).catch(() => {});
    setDoc(doc(db, VOUCHERS_COL, voucherId), voucherData).catch(() => {});

    return { wonAmount, voucherId };
  },

  // --- VOUCHER WALLET ---

  subscribeToCustomerVouchers(
    customerId: string,
    callback: (vouchers: Voucher[]) => void
  ): () => void {
    const local = getLocalVouchers().filter((v) => v.customerId === customerId);
    callback(local);

    try {
      const q = query(
        collection(db, VOUCHERS_COL),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const cloudVouchers = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Voucher, 'id'>)
          }));

          const mergedMap = new Map<string, Voucher>();
          local.forEach((v) => mergedMap.set(v.id, v));
          cloudVouchers.forEach((v) => mergedMap.set(v.id, v));

          callback(Array.from(mergedMap.values()));
        },
        () => {
          callback(local);
        }
      );

      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  // --- REWARD PROFILE / STREAK ---

  subscribeToRewardProfile(
    customerId: string,
    callback: (profile: RewardProfile | null) => void
  ): () => void {
    let localProf: RewardProfile = {
      customerId,
      streak: 0,
      totalPurchases: 0,
      isGiftEligible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[customerId]) {
          localProf = parsed[customerId];
        }
      }
    } catch {}

    callback(localProf);

    try {
      const docRef = doc(db, REWARD_PROFILES_COL, customerId);
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            callback(snap.data() as RewardProfile);
          } else {
            callback(localProf);
          }
        },
        () => {
          callback(localProf);
        }
      );
      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async getAllCustomerRewardProfiles(): Promise<RewardProfile[]> {
    const list: RewardProfile[] = [];
    try {
      const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.values(parsed).forEach((p: any) => list.push(p));
      }
    } catch {}

    try {
      const snap = await getDocs(collection(db, REWARD_PROFILES_COL));
      snap.docs.forEach((d) => {
        const cloudData = d.data() as RewardProfile;
        if (!list.some((p) => p.customerId === cloudData.customerId)) {
          list.push(cloudData);
        }
      });
    } catch {}

    return list;
  }
};
