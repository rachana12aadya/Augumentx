import type { AssessmentAnswers, Recommendation, Technology } from '@/types';
import { technologies } from '@/data/technologies';

const categoryMap: Record<string, string[]> = {
  mobility: ['mobility', 'rehabilitation'],
  strength: ['strength', 'ergonomics'],
  balance: ['balance', 'rehabilitation'],
  endurance: ['endurance', 'sports'],
  dexterity: ['dexterity'],
  rehabilitation: ['rehabilitation'],
  workplace: ['ergonomics'],
  sports: ['sports'],
  independence: ['mobility', 'dexterity'],
};

const environmentMap: Record<string, string[]> = {
  home: ['assistive', 'healthcare'],
  workplace: ['industrial', 'sports'],
  clinic: ['healthcare'],
  hospital: ['healthcare'],
  outdoor: ['mobility', 'sports'],
  sports: ['sports', 'industrial'],
};

const preferenceTypeMap: Record<string, string[]> = {
  lightweight: ['wearable', 'sensor', 'orthotic'],
  wearable: ['wearable', 'sensor'],
  discreet: ['wearable', 'orthotic', 'sensor'],
  powered: ['powered', 'robotic'],
  passive: ['passive', 'orthotic', 'wearable'],
  maximum: ['robotic', 'powered'],
  freedom: ['wearable', 'passive'],
  easy: ['passive', 'orthotic', 'wearable'],
};

function calculateGoalScore(tech: Technology, goals: string[]): number {
  if (goals.length === 0) return 50;
  let matches = 0;
  goals.forEach(goal => {
    const related = categoryMap[goal] || [];
    if (tech.useCases.some(uc => related.includes(uc))) matches++;
    if (tech.category === goal || related.some(r => tech.category.includes(r))) matches++;
  });
  return Math.min(100, Math.round((matches / goals.length) * 100 + 30));
}

function calculateActivityScore(tech: Technology, activities: string[]): number {
  if (activities.length === 0) return 50;
  const activityUseCaseMap: Record<string, string[]> = {
    walking: ['mobility', 'rehabilitation'],
    standing: ['ergonomics', 'balance'],
    stairs: ['mobility', 'strength'],
    lifting: ['strength', 'ergonomics'],
    reaching: ['dexterity', 'ergonomics'],
    running: ['sports', 'endurance'],
    transfers: ['mobility', 'rehabilitation'],
    fine: ['dexterity'],
    repetitive: ['ergonomics', 'endurance'],
    sports: ['sports', 'endurance'],
  };
  let score = 0;
  activities.forEach(activity => {
    const key = Object.keys(activityUseCaseMap).find(k => activity.toLowerCase().includes(k));
    const cases = key ? activityUseCaseMap[key] : [];
    if (tech.useCases.some(uc => cases.includes(uc))) score += 20;
  });
  return Math.min(100, Math.round(score / activities.length + 40));
}

function calculateEnvironmentScore(tech: Technology, environments: string[]): number {
  if (environments.length === 0) return 50;
  let score = 0;
  environments.forEach(env => {
    const cats = environmentMap[env] || [];
    if (cats.includes(tech.category)) score += 25;
  });
  return Math.min(100, Math.round(score / environments.length + 40));
}

function calculatePreferenceScore(tech: Technology, preferences: string[]): number {
  if (preferences.length === 0) return 50;
  let score = 0;
  preferences.forEach(pref => {
    const types = preferenceTypeMap[pref] || [];
    if (types.includes(tech.type)) score += 25;
  });
  return Math.min(100, Math.round(score / preferences.length + 30));
}

function calculateEvidenceScore(evidence: string): number {
  const map: Record<string, number> = { emerging: 40, early: 60, moderate: 80, strong: 95 };
  return map[evidence] || 50;
}

function generateReasoning(tech: Technology, answers: AssessmentAnswers): string {
  const parts: string[] = [];
  if (answers.goals.length > 0) {
    const goalNames = answers.goals.join(' and ');
    parts.push(`${tech.name} aligns with your ${goalNames} goals`);
  }
  if (answers.activities.length > 0) {
    parts.push(`and supports your ${answers.activities.slice(0, 2).join(' and ')} activities`);
  }
  if (answers.preferences.length > 0) {
    parts.push(`matching your preference for ${answers.preferences[0]} solutions`);
  }
  if (parts.length === 0) {
    return `${tech.name} is a versatile augmentation technology that may support your overall wellness goals.`;
  }
  return `${tech.name} was recommended because it ${parts.join(' ')}.`;
}

export function generateRecommendations(answers: AssessmentAnswers): Recommendation[] {
  const scored = technologies.map(tech => {
    const goalScore = calculateGoalScore(tech, answers.goals);
    const activityScore = calculateActivityScore(tech, answers.activities);
    const envScore = calculateEnvironmentScore(tech, answers.environment);
    const prefScore = calculatePreferenceScore(tech, answers.preferences);
    const evidenceScore = calculateEvidenceScore(tech.evidence);

    const overall = Math.round(
      goalScore * 0.3 + activityScore * 0.25 + envScore * 0.15 + prefScore * 0.2 + evidenceScore * 0.1
    );

    return {
      technologyId: tech.id,
      overallScore: overall,
      goalAlignment: goalScore,
      activityFit: activityScore,
      environmentFit: envScore,
      preferenceFit: prefScore,
      evidenceScore,
      reasoning: generateReasoning(tech, answers),
    };
  });

  return scored
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);
}
