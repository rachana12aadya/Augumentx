import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Dumbbell,
  Scale,
  Timer,
  Hand,
  Wrench,
  Briefcase,
  Trophy,
  HeartPulse,
  ArrowUp,
  Package,
  PenTool,
  Zap,
  ArrowLeftRight,
  RefreshCw,
  Clock,
  Target,
  Activity,
  BriefcaseBusiness,
  Home,
  Building2,
  Stethoscope,
  Hospital,
  TreePine,
  DumbbellIcon,
  Feather,
  Watch,
  EyeOff,
  Power,
  ShieldCheck,
  Maximize2,
  Expand,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/services/storage';
import type { AssessmentAnswers } from '@/types';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

interface Option {
  key: string;
  label: string;
  icon: IconComponent;
}

interface StepData {
  question: string;
  subtitle: string;
  options: Option[];
}

const STEPS: StepData[] = [
  {
    question: 'What would you most like to improve?',
    subtitle: 'Select all that apply — we\'ll tailor recommendations to your goals.',
    options: [
      { key: 'mobility', label: 'Mobility', icon: Footprints },
      { key: 'strength', label: 'Strength', icon: Dumbbell },
      { key: 'balance', label: 'Balance', icon: Scale },
      { key: 'endurance', label: 'Endurance', icon: Timer },
      { key: 'dexterity', label: 'Dexterity', icon: Hand },
      { key: 'rehabilitation', label: 'Rehabilitation', icon: Wrench },
      { key: 'ergonomics', label: 'Workplace ergonomics', icon: Briefcase },
      { key: 'sports', label: 'Sports performance', icon: Trophy },
      { key: 'independence', label: 'Independence', icon: HeartPulse },
    ],
  },
  {
    question: 'Which activities matter most to you?',
    subtitle: 'Choose the activities where you\'d benefit from augmentation technology.',
    options: [
      { key: 'walking', label: 'Walking', icon: Footprints },
      { key: 'standing', label: 'Standing', icon: ArrowUp },
      { key: 'stairs', label: 'Stairs', icon: ArrowUp },
      { key: 'lifting', label: 'Lifting', icon: Package },
      { key: 'reaching', label: 'Reaching', icon: Hand },
      { key: 'running', label: 'Running', icon: Zap },
      { key: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
      { key: 'fine', label: 'Fine motor tasks', icon: PenTool },
      { key: 'repetitive', label: 'Repetitive work', icon: RefreshCw },
      { key: 'sports', label: 'Sports', icon: Trophy },
    ],
  },
  {
    question: 'What challenges are you trying to address?',
    subtitle: 'Identify the main obstacles in your daily life or work.',
    options: [
      { key: 'fatigue', label: 'Fatigue', icon: Clock },
      { key: 'mobility', label: 'Mobility limitations', icon: Footprints },
      { key: 'balance', label: 'Balance', icon: Scale },
      { key: 'strength', label: 'Strength', icon: Dumbbell },
      { key: 'coordination', label: 'Coordination', icon: Target },
      { key: 'workload', label: 'Physical workload', icon: BriefcaseBusiness },
      { key: 'endurance', label: 'Endurance', icon: Timer },
      { key: 'strain', label: 'Repetitive strain', icon: Activity },
    ],
  },
  {
    question: 'Where would you use augmentation technology?',
    subtitle: 'Select the environments where the technology would be most useful.',
    options: [
      { key: 'home', label: 'Home', icon: Home },
      { key: 'workplace', label: 'Workplace', icon: Building2 },
      { key: 'clinic', label: 'Clinic', icon: Stethoscope },
      { key: 'hospital', label: 'Hospital', icon: Hospital },
      { key: 'outdoor', label: 'Outdoor', icon: TreePine },
      { key: 'sports', label: 'Sports facility', icon: DumbbellIcon },
    ],
  },
  {
    question: 'What matters most in a technology?',
    subtitle: 'Help us understand your priorities for the right solution.',
    options: [
      { key: 'lightweight', label: 'Lightweight', icon: Feather },
      { key: 'wearable', label: 'Wearable', icon: Watch },
      { key: 'discreet', label: 'Discreet', icon: EyeOff },
      { key: 'powered', label: 'Powered', icon: Power },
      { key: 'passive', label: 'Passive', icon: ShieldCheck },
      { key: 'maximum', label: 'Maximum assistance', icon: Maximize2 },
      { key: 'freedom', label: 'Freedom of movement', icon: Expand },
      { key: 'easy', label: 'Easy to use', icon: Sparkles },
    ],
  },
];

const STEP_LABELS = ['Goals', 'Activities', 'Challenges', 'Environment', 'Preferences', 'Review'];

const REVIEW_SECTIONS: { key: keyof AssessmentAnswers; title: string; step: number }[] = [
  { key: 'goals', title: 'Goals', step: 0 },
  { key: 'activities', title: 'Activities', step: 1 },
  { key: 'challenges', title: 'Challenges', step: 2 },
  { key: 'environment', title: 'Environment', step: 3 },
  { key: 'preferences', title: 'Preferences', step: 4 },
];

function findOption(stepIndex: number, key: string): Option | undefined {
  return STEPS[stepIndex]?.options.find((o) => o.key === key);
}

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-8">
      {STEP_LABELS.map((label, i) => {
        const completed = i < current;
        const active = i === current;

        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                  completed && 'bg-primary-500 text-white',
                  active &&
                    'bg-primary-100 text-primary-700 ring-4 ring-primary-200',
                  !completed && !active && 'bg-surface-muted text-text-muted',
                )}
              >
                {completed ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span
                className={cn(
                  'mt-2 hidden text-xs font-medium sm:block',
                  active ? 'text-primary-700' : 'text-text-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors duration-300 sm:mx-4',
                  i < current ? 'bg-primary-500' : 'bg-surface-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-[44px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200',
        'hover:shadow-md',
        selected
          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
          : 'border-surface-border bg-surface-card text-text-primary hover:border-primary-200',
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
          selected ? 'bg-primary-100 text-primary-600' : 'bg-surface-muted text-text-secondary',
        )}
      >
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium">{option.label}</span>
      {selected && (
        <Check className="ml-auto h-4 w-4 flex-shrink-0 text-primary-500" />
      )}
    </button>
  );
}

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    goals: [],
    activities: [],
    challenges: [],
    environment: [],
    preferences: [],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const answerKeys: (keyof AssessmentAnswers)[] = [
    'goals',
    'activities',
    'challenges',
    'environment',
    'preferences',
  ];

  const currentKey = answerKeys[step];

  function toggle(optionKey: string) {
    if (!currentKey) return;
    setAnswers((prev) => {
      const list = prev[currentKey];
      const next = list.includes(optionKey)
        ? list.filter((k) => k !== optionKey)
        : [...list, optionKey];
      return { ...prev, [currentKey]: next };
    });
  }

  const canProceed = currentKey ? answers[currentKey].length > 0 : true;

  function goNext() {
    if (step < 5 && canProceed) setStep(step + 1);
  }

  function goPrev() {
    if (step > 0) setStep(step - 1);
  }

  function goToStep(target: number) {
    if (target >= 0 && target <= 5) setStep(target);
  }

  function handleGenerate() {
    setIsAnalyzing(true);
    storage.setAssessment(answers);
    setTimeout(() => {
      navigate('/recommendations');
    }, 2500);
  }

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
            <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary-500" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-text-primary">
              Analyzing your augmentation profile...
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Matching your goals with the best technologies
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          Augmentation Assessment
        </h1>
        <p className="mt-2 text-text-secondary">
          Answer a few questions to get personalized technology recommendations.
        </p>
      </div>

      <div className="mb-10">
        <ProgressBar current={step} />
      </div>

      <div key={step} className="animate-fade-in">
        {step < 5 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text-primary">
              {STEPS[step].question}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {STEPS[step].subtitle}
            </p>
          </div>
        )}

        {step < 5 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS[step].options.map((option) => (
              <OptionCard
                key={option.key}
                option={option}
                selected={currentKey ? answers[currentKey].includes(option.key) : false}
                onClick={() => toggle(option.key)}
              />
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">
              Your Assessment Summary
            </h2>
            <p className="text-sm text-text-secondary">
              Review your selections before generating recommendations.
            </p>

            <div className="space-y-4">
              {REVIEW_SECTIONS.map(({ key, title, step: sectionStep }) => (
                <div
                  key={key}
                  className="rounded-xl border border-surface-border bg-surface-card p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">{title}</h3>
                    <button
                      type="button"
                      onClick={() => goToStep(sectionStep)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                  </div>
                  {answers[key].length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {answers[key].map((itemKey) => {
                        const opt = findOption(sectionStep, itemKey);
                        if (!opt) return null;
                        const Icon = opt.icon;
                        return (
                          <span
                            key={itemKey}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                          >
                            <Icon size={12} />
                            {opt.label}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">No selections</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl active:scale-[0.98]"
            >
              <Sparkles size={18} />
              Generate My Recommendations
            </button>
          </div>
        )}
      </div>

      {step < 5 && (
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            className={cn(
              'flex items-center gap-1 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',
              step === 0
                ? 'cursor-not-allowed text-text-muted'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
            )}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className={cn(
              'flex items-center gap-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200',
              canProceed
                ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]'
                : 'cursor-not-allowed bg-surface-muted text-text-muted',
            )}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
