export type TechnologyCategory = 'healthcare' | 'assistive' | 'industrial' | 'sports' | 'mobility' | 'emerging';

export type TechnologyType = 'wearable' | 'robotic' | 'powered' | 'passive' | 'sensor' | 'prosthetic' | 'orthotic';

export type EvidenceLevel = 'emerging' | 'early' | 'moderate' | 'strong';

export type UseCase = 'mobility' | 'strength' | 'balance' | 'endurance' | 'dexterity' | 'rehabilitation' | 'ergonomics' | 'sports';

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  type: TechnologyType;
  evidence: EvidenceLevel;
  useCases: UseCase[];
  description: string;
  shortDescription: string;
  benefits: string[];
  specifications: string[];
  considerations: string[];
  whoItHelps: string[];
  questionsToAsk: string[];
  howItWorks: string;
}

export interface ResearchArticle {
  id: string;
  title: string;
  year: number;
  technology: string;
  category: TechnologyCategory;
  evidence: EvidenceLevel;
  summary: string;
}

export interface AssessmentAnswers {
  goals: string[];
  activities: string[];
  challenges: string[];
  environment: string[];
  preferences: string[];
}

export interface Recommendation {
  technologyId: string;
  overallScore: number;
  goalAlignment: number;
  activityFit: number;
  environmentFit: number;
  preferenceFit: number;
  evidenceScore: number;
  reasoning: string;
}

export interface PlanItem {
  id: string;
  technologyId: string;
  goal: string;
  baseline: string;
  target: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface ProgressMeasurement {
  id: string;
  metric: string;
  value: number;
  unit: string;
  date: string;
  note: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'individual' | 'professional' | 'provider' | 'admin';
  goals: string[];
  preferences: string[];
  notifications: {
    email: boolean;
    progress: boolean;
    recommendations: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'individual' | 'professional' | 'provider' | 'admin';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type DemoUser = {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  assessments: number;
};
