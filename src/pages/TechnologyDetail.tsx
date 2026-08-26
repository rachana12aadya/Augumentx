import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Plus,
  Check,
  Target,
  Zap,
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTechnologyById } from '@/data/technologies';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import type { TechnologyCategory, TechnologyType, EvidenceLevel } from '@/types';

const categoryColors: Record<TechnologyCategory, string> = {
  healthcare: 'bg-blue-100 text-blue-800',
  assistive: 'bg-purple-100 text-purple-800',
  industrial: 'bg-orange-100 text-orange-800',
  sports: 'bg-green-100 text-green-800',
  mobility: 'bg-teal-100 text-teal-800',
  emerging: 'bg-pink-100 text-pink-800',
};

const typeColors: Record<TechnologyType, string> = {
  wearable: 'bg-cyan-100 text-cyan-800',
  robotic: 'bg-red-100 text-red-800',
  powered: 'bg-amber-100 text-amber-800',
  passive: 'bg-gray-100 text-gray-800',
  sensor: 'bg-indigo-100 text-indigo-800',
  prosthetic: 'bg-violet-100 text-violet-800',
  orthotic: 'bg-lime-100 text-lime-800',
};

const evidenceColors: Record<EvidenceLevel, string> = {
  emerging: 'bg-yellow-100 text-yellow-800',
  early: 'bg-orange-100 text-orange-800',
  moderate: 'bg-blue-100 text-blue-800',
  strong: 'bg-green-100 text-green-800',
};

const evidenceDescriptions: Record<EvidenceLevel, string> = {
  emerging: 'Limited early-stage research. Results are preliminary and more studies are needed.',
  early: 'Initial clinical studies show promise. Larger trials are ongoing.',
  moderate: 'Supported by multiple studies with consistent positive outcomes.',
  strong: 'Robust evidence from large-scale clinical trials and systematic reviews.',
};

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </span>
      </button>
      {isOpen && <div className="pb-6 text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function TechnologyDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [isInPlan, setIsInPlan] = useState(false);

  const technology = id ? getTechnologyById(id) : undefined;

  useEffect(() => {
    if (technology) {
      const plan = storage.getPlan();
      setIsInPlan(plan.some((item) => item.technologyId === technology.id));
    }
  }, [technology]);

  if (!technology) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Technology not found</h1>
          <p className="text-gray-500 mb-6">
            The technology you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/technologies"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Technologies
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToPlan = () => {
    if (isInPlan) {
      addToast('Already in My Plan', 'info');
      return;
    }

    const plan = storage.getPlan();
    const newPlanItem = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      technologyId: technology.id,
      goal: '',
      baseline: '',
      target: '',
      progress: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    storage.setPlan([...plan, newPlanItem]);
    setIsInPlan(true);
    addToast(`${technology.name} added to your plan!`, 'success');
  };

  const specEntries = technology.specifications.map((spec) => {
    const colonIndex = spec.indexOf(':');
    if (colonIndex > 0) {
      return {
        label: spec.substring(0, colonIndex).trim(),
        value: spec.substring(colonIndex + 1).trim(),
      };
    }
    return { label: '', value: spec };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/technologies"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Technologies
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            Demo Technology
          </span>
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
              categoryColors[technology.category]
            )}
          >
            {technology.category}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
              evidenceColors[technology.evidence]
            )}
          >
            {technology.evidence} evidence
          </span>
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
              typeColors[technology.type]
            )}
          >
            {technology.type}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{technology.name}</h1>
        <p className="text-lg text-gray-600">{technology.shortDescription}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <button
          onClick={handleAddToPlan}
          disabled={isInPlan}
          className={cn(
            'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all',
            isInPlan
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm'
          )}
        >
          {isInPlan ? (
            <>
              <Check className="w-4 h-4" />
              Already in My Plan
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to My Plan
            </>
          )}
        </button>

        <Link
          to="/assessment"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <Target className="w-4 h-4" />
          Start Assessment
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        <CollapsibleSection title="Overview" icon={<Info className="w-5 h-5" />} defaultOpen>
          <p className="mb-4">{technology.description}</p>
          <div className="flex flex-wrap gap-2">
            {technology.useCases.map((uc) => (
              <span
                key={uc}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize"
              >
                {uc}
              </span>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="How It Works" icon={<Zap className="w-5 h-5" />}>
          <p>{technology.howItWorks}</p>
        </CollapsibleSection>

        <CollapsibleSection title="Potential Benefits" icon={<CheckCircle2 className="w-5 h-5" />}>
          <ul className="space-y-3">
            {technology.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Typical Use Cases" icon={<Target className="w-5 h-5" />}>
          <p className="mb-4">
            This technology is designed for individuals who need assistance in the following scenarios:
          </p>
          <ul className="space-y-2">
            {technology.whoItHelps.map((who, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>{who}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Technology Specifications" icon={<Zap className="w-5 h-5" />}>
          <div className="grid gap-3">
            {specEntries.map((spec, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-50 last:border-0"
              >
                {spec.label ? (
                  <>
                    <span className="text-sm font-medium text-gray-500 sm:w-48 flex-shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-gray-900">{spec.value}</span>
                  </>
                ) : (
                  <span className="text-gray-900">{spec.value}</span>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Considerations" icon={<AlertTriangle className="w-5 h-5" />}>
          <ul className="space-y-3">
            {technology.considerations.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-900">{item}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Evidence" icon={<Shield className="w-5 h-5" />}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
                  evidenceColors[technology.evidence]
                )}
              >
                {technology.evidence} evidence
              </span>
            </div>
            <p className="text-gray-700">
              {evidenceDescriptions[technology.evidence]}
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Who Might Explore This Technology" icon={<Users className="w-5 h-5" />}>
          <ul className="space-y-3">
            {technology.whoItHelps.map((who, i) => (
              <li key={i} className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{who}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Questions to Discuss With a Professional" icon={<MessageSquare className="w-5 h-5" />}>
          <ol className="space-y-4">
            {technology.questionsToAsk.map((question, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{question}</span>
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      </div>

      <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-500 leading-relaxed">
            AugmentX provides educational information only. Technology suitability should be evaluated
            with an appropriately qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}
