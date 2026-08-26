import type { AssessmentAnswers, PlanItem, ProgressMeasurement, UserProfile } from '@/types';

export interface StoredUser {
  email: string;
  name: string;
  role: 'individual' | 'professional' | 'provider' | 'admin';
}

const KEYS = {
  USER: 'augmentx_user',
  ASSESSMENT: 'augmentx_assessment',
  PLAN: 'augmentx_plan',
  PROGRESS: 'augmentx_progress',
  PROFILE: 'augmentx_profile',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUser: () => get<StoredUser | null>(KEYS.USER, null),
  setUser: (user: StoredUser | null) => set(KEYS.USER, user),

  getAssessment: () => get<AssessmentAnswers | null>(KEYS.ASSESSMENT, null),
  setAssessment: (answers: AssessmentAnswers) => set(KEYS.ASSESSMENT, answers),

  getPlan: () => get<PlanItem[]>(KEYS.PLAN, []),
  setPlan: (plan: PlanItem[]) => set(KEYS.PLAN, plan),

  getProgress: () => get<ProgressMeasurement[]>(KEYS.PROGRESS, []),
  setProgress: (progress: ProgressMeasurement[]) => set(KEYS.PROGRESS, progress),

  getProfile: () => get<UserProfile | null>(KEYS.PROFILE, null),
  setProfile: (profile: UserProfile) => set(KEYS.PROFILE, profile),

  clearAll: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },
};
