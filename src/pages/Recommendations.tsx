import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Target,
  Layers,
  MapPin,
  Sliders,
  Lightbulb,
  ChevronRight,
  Plus,
  Check,
  BarChart3,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { storage } from '@/services/storage';
import { getTechnologyById } from '@/data/technologies';
import { generateRecommendations } from '@/services/recommendations';
import { useToast } from '@/hooks/useToast';
import type { Recommendation } from '@/types';

const GOAL_LABELS: Record<string, string> = {
  mobility: 'Mobility',
  strength: 'Strength',
  balance: 'Balance',
  endurance: 'Endurance',
  dexterity: 'Dexterity',
  rehabilitation: 'Rehabilitation',
  ergonomics: 'Workplace Ergonomics',
  sports: 'Sports Performance',
  independence: 'Independence',
};

const ENV_LABELS: Record<string, string> = {
  home: 'Home',
  workplace: 'Workplace',
  clinic: 'Clinic',
  hospital: 'Hospital',
  outdoor: 'Outdoor',
  sports: 'Sports Facility',
};

const PREF_LABELS: Record<string, string> = {
  lightweight: 'Lightweight',
  wearable: 'Wearable',
  discreet: 'Discreet',
  powered: 'Powered',
  passive: 'Passive',
  maximum: 'Maximum Assistance',
  freedom: 'Freedom of Movement',
  easy: 'Easy to Use',
};

const projectedData = [
  { week: 'Week 1', score: 35 },
  { week: 'Week 2', score: 41 },
  { week: 'Week 3', score: 48 },
  { week: 'Week 4', score: 55 },
  { week: 'Week 5', score: 62 },
  { week: 'Week 6', score: 70 },
  { week: 'Week 7', score: 76 },
  { week: 'Week 8', score: 82 },
];

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-text-primary">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  added,
  onAddToPlan,
}: {
  recommendation: Recommendation;
  added: boolean;
  onAddToPlan: () => void;
}) {
  const tech = getTechnologyById(recommendation.technologyId);
  if (!tech) return null;

  return (
    <div className="animate-fade-in overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* Left: score + actions */}
        <div className="flex flex-col items-center gap-4 border-b border-surface-border bg-gradient-to-br from-primary-50 to-blue-50 px-6 py-8 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#2563eb"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={326.73}
                strokeDashoffset={
                  326.73 - (326.73 * recommendation.overallScore) / 100
                }
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary-600">
                {recommendation.overallScore}
              </span>
              <span className="text-xs font-medium text-primary-500">/ 100</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-bold text-primary-700">
            {recommendation.overallScore}% Match
          </span>
          <div className="mt-auto flex w-full flex-col gap-2">
            <Link
              to={`/technologies/${tech.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.98]"
            >
              View Technology
              <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onAddToPlan}
              disabled={added}
              className={cn(
                'flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]',
                added
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                  : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50',
              )}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added ✓
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to My Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: details */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 capitalize">
              {tech.category}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize">
              {tech.type}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 capitalize">
              {tech.evidence} evidence
            </span>
          </div>

          <h3 className="mb-1 text-xl font-bold text-text-primary">
            {tech.name}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary">
            {tech.shortDescription}
          </p>

          {/* Score breakdown */}
          <div className="mb-6 space-y-3 rounded-xl bg-surface-muted/50 p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Match Breakdown
            </h4>
            <ScoreBar
              label="Goal Alignment"
              value={recommendation.goalAlignment}
              color="bg-primary-500"
            />
            <ScoreBar
              label="Activity Fit"
              value={recommendation.activityFit}
              color="bg-cyan-500"
            />
            <ScoreBar
              label="Environment Fit"
              value={recommendation.environmentFit}
              color="bg-teal-500"
            />
            <ScoreBar
              label="Preference Fit"
              value={recommendation.preferenceFit}
              color="bg-violet-500"
            />
            <ScoreBar
              label="Evidence"
              value={recommendation.evidenceScore}
              color="bg-amber-500"
            />
          </div>

          {/* Reasoning */}
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
            <div>
              <h4 className="mb-1 text-sm font-semibold text-amber-800">
                Why this was recommended
              </h4>
              <p className="text-sm leading-relaxed text-amber-700">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const { addToast } = useToast();
  const assessment = storage.getAssessment();
  const [planIds, setPlanIds] = useState<Set<string>>(() => {
    const plan = storage.getPlan();
    return new Set(plan.map((p) => p.technologyId));
  });

  const recommendations = useMemo(() => {
    if (!assessment) return [];
    return generateRecommendations(assessment);
  }, [assessment]);

  if (!assessment) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="animate-fade-in max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <ClipboardList className="h-10 w-10 text-primary-500" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-text-primary">
            No Assessment Found
          </h1>
          <p className="mb-8 leading-relaxed text-text-secondary">
            Complete the augmentation assessment so we can generate personalized
            technology recommendations based on your goals and preferences.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl active:scale-[0.98]"
          >
            Take the Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  function handleAddToPlan(rec: Recommendation) {
    if (planIds.has(rec.technologyId)) {
      addToast('Already in your plan', 'info');
      return;
    }
    const tech = getTechnologyById(rec.technologyId);
    const plan = storage.getPlan();
    const newPlanItem = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      technologyId: rec.technologyId,
      goal: '',
      baseline: '',
      target: '',
      progress: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };
    storage.setPlan([...plan, newPlanItem]);
    setPlanIds((prev) => new Set([...prev, rec.technologyId]));
    addToast(`${tech?.name ?? 'Technology'} added to your plan!`, 'success');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── HEADER ─── */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Your Augmentation Profile
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Based on your assessment we've matched you with the technologies that
          best align with your goals, activities, and preferences.
        </p>
      </div>

      {/* ─── PROFILE SUMMARY ─── */}
      <div className="mb-12 animate-fade-in overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        <div className="border-b border-surface-border bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <Layers className="h-5 w-5 text-primary-500" />
            Assessment Summary
          </h2>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-3">
          {/* Goals */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary-500" />
              <h3 className="text-sm font-semibold text-text-primary">
                Primary Goals
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {assessment.goals.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                >
                  {GOAL_LABELS[g] || g}
                </span>
              ))}
            </div>
          </div>
          {/* Environment */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-500" />
              <h3 className="text-sm font-semibold text-text-primary">
                Preferred Environment
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {assessment.environment.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700"
                >
                  {ENV_LABELS[e] || e}
                </span>
              ))}
            </div>
          </div>
          {/* Preferences */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-violet-500" />
              <h3 className="text-sm font-semibold text-text-primary">
                Technology Preferences
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {assessment.preferences.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {PREF_LABELS[p] || p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TOP MATCHES ─── */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-text-primary">Top Matches</h2>
          <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-bold text-primary-700">
            {recommendations.length}
          </span>
        </div>
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.technologyId}
              recommendation={rec}
              added={planIds.has(rec.technologyId)}
              onAddToPlan={() => handleAddToPlan(rec)}
            />
          ))}
        </div>
      </div>

      {/* ─── PROJECTED PERFORMANCE ─── */}
      <div className="animate-fade-in overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        <div className="border-b border-surface-border bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Projected Performance Improvement
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Estimated score trajectory if you follow your recommended plan over
            8 weeks.
          </p>
        </div>
        <div className="p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectedData}>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [`${value}%`, 'Projected Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
            Projected Overall Score
          </div>
        </div>
      </div>
    </div>
  );
}
