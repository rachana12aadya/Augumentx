import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp, Plus, Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { technologies } from '@/data/technologies';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import type { TechnologyCategory, TechnologyType, EvidenceLevel, UseCase } from '@/types';

const CATEGORIES: { value: TechnologyCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'healthcare', label: 'Healthcare & Rehabilitation' },
  { value: 'assistive', label: 'Assistive Living' },
  { value: 'industrial', label: 'Industrial Ergonomics' },
  { value: 'sports', label: 'Sports & Performance' },
  { value: 'mobility', label: 'Personal Mobility' },
  { value: 'emerging', label: 'Emerging Technologies' },
];

const TYPES: { value: TechnologyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wearable', label: 'Wearable' },
  { value: 'robotic', label: 'Robotic' },
  { value: 'powered', label: 'Powered' },
  { value: 'passive', label: 'Passive' },
  { value: 'sensor', label: 'Sensor' },
  { value: 'prosthetic', label: 'Prosthetic' },
  { value: 'orthotic', label: 'Orthotic' },
];

const EVIDENCE_LEVELS: { value: EvidenceLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'early', label: 'Early' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
];

const USE_CASES: { value: UseCase | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'strength', label: 'Strength' },
  { value: 'balance', label: 'Balance' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'dexterity', label: 'Dexterity' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'ergonomics', label: 'Ergonomics' },
  { value: 'sports', label: 'Sports' },
];

const CATEGORY_GRADIENTS: Record<TechnologyCategory, string> = {
  healthcare: 'from-blue-500 to-blue-700',
  assistive: 'from-green-500 to-green-700',
  industrial: 'from-orange-500 to-orange-700',
  sports: 'from-purple-500 to-purple-700',
  mobility: 'from-teal-500 to-teal-700',
  emerging: 'from-pink-500 to-pink-700',
};

const CATEGORY_ICONS: Record<TechnologyCategory, string> = {
  healthcare: '🏥',
  assistive: '🦾',
  industrial: '⚙️',
  sports: '🏃',
  mobility: '🦿',
  emerging: '✨',
};

const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  emerging: 'bg-gray-100 text-gray-700',
  early: 'bg-yellow-100 text-yellow-700',
  moderate: 'bg-blue-100 text-blue-700',
  strong: 'bg-green-100 text-green-700',
};

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

function FilterChip({ label, active, onClick, onRemove }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={active ? onRemove || onClick : onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      )}
    >
      {label}
      {active && onRemove && (
        <X className="h-3 w-3" />
      )}
    </button>
  );
}

interface FilterSectionProps {
  title: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  defaultOpen?: boolean;
}

function FilterSection({ title, options, selected, onSelect, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-900"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              active={selected === option.value}
              onClick={() => onSelect(option.value)}
              onRemove={selected === option.value && option.value !== 'all' ? () => onSelect('all') : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TechnologyCardProps {
  technology: typeof technologies[0];
  onAddToPlan: (technologyId: string) => void;
  addedToPlan: string | null;
}

function TechnologyCard({ technology, onAddToPlan, addedToPlan }: TechnologyCardProps) {
  const isAdded = addedToPlan === technology.id;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md card-hover">
      {/* Gradient Header */}
      <div className={cn('relative h-24 bg-gradient-to-r', CATEGORY_GRADIENTS[technology.category])}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">{CATEGORY_ICONS[technology.category]}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Demo Technology
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{technology.name}</h3>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 capitalize">
            {technology.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 capitalize">
            {technology.type}
          </span>
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', EVIDENCE_COLORS[technology.evidence])}>
            {technology.evidence}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {technology.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {technology.useCases.map((useCase) => (
            <span
              key={useCase}
              className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600 capitalize"
            >
              {useCase}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <Link
            to={`/technologies/${technology.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onAddToPlan(technology.id)}
            disabled={isAdded}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
              isAdded
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Technologies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TechnologyCategory | 'all'>(
    (searchParams.get('category') as TechnologyCategory | 'all') || 'all'
  );
  const [selectedType, setSelectedType] = useState<TechnologyType | 'all'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceLevel | 'all'>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | 'all'>('all');
  const [addedToPlan, setAddedToPlan] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL params
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  // Filter technologies
  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) => {
      // Search filter
      if (debouncedQuery) {
        const query = debouncedQuery.toLowerCase();
        const matchesSearch =
          tech.name.toLowerCase().includes(query) ||
          tech.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tech.category !== selectedCategory) return false;

      // Type filter
      if (selectedType !== 'all' && tech.type !== selectedType) return false;

      // Evidence filter
      if (selectedEvidence !== 'all' && tech.evidence !== selectedEvidence) return false;

      // Use case filter
      if (selectedUseCase !== 'all' && !tech.useCases.includes(selectedUseCase)) return false;

      return true;
    });
  }, [debouncedQuery, selectedCategory, selectedType, selectedEvidence, selectedUseCase]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || selectedEvidence !== 'all' || selectedUseCase !== 'all' || debouncedQuery;

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedEvidence('all');
    setSelectedUseCase('all');
    setSearchParams({});
  }, [setSearchParams]);

  const handleAddToPlan = useCallback((technologyId: string) => {
    const plan = storage.getPlan();
    const newPlanItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      technologyId,
      goal: '',
      baseline: '',
      target: '',
      progress: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };
    storage.setPlan([...plan, newPlanItem]);
    setAddedToPlan(technologyId);
    addToast('Technology added to your plan!', 'success');
    setTimeout(() => setAddedToPlan(null), 2000);
  }, [addToast]);

  const filtersSidebar = (
    <div className="space-y-6">
      <FilterSection
        title="Category"
        options={CATEGORIES}
        selected={selectedCategory}
        onSelect={(v) => setSelectedCategory(v as TechnologyCategory | 'all')}
      />
      <FilterSection
        title="Technology Type"
        options={TYPES}
        selected={selectedType}
        onSelect={(v) => setSelectedType(v as TechnologyType | 'all')}
      />
      <FilterSection
        title="Evidence Level"
        options={EVIDENCE_LEVELS}
        selected={selectedEvidence}
        onSelect={(v) => setSelectedEvidence(v as EvidenceLevel | 'all')}
      />
      <FilterSection
        title="Use Case"
        options={USE_CASES}
        selected={selectedUseCase}
        onSelect={(v) => setSelectedUseCase(v as UseCase | 'all')}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Explore Technologies
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-slate-600">
            Discover technologies designed to support human capability, rehabilitation, performance and independence.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Mobile Filter Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:hidden">
            {filtersSidebar}
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Active filters:</span>
            {debouncedQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                Search: "{debouncedQuery}"
                <button type="button" onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 capitalize">
                {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 capitalize">
                {selectedType}
                <button type="button" onClick={() => setSelectedType('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedEvidence !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 capitalize">
                {selectedEvidence}
                <button type="button" onClick={() => setSelectedEvidence('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedUseCase !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 capitalize">
                {selectedUseCase}
                <button type="button" onClick={() => setSelectedUseCase('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {filtersSidebar}
            </div>
          </aside>

          {/* Technology Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredTechnologies.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{technologies.length}</span> technologies
              </p>
            </div>

            {filteredTechnologies.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTechnologies.map((tech) => (
                  <TechnologyCard
                    key={tech.id}
                    technology={tech}
                    onAddToPlan={handleAddToPlan}
                    addedToPlan={addedToPlan}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="text-lg font-semibold text-slate-900">No technologies found</h3>
                <p className="mt-2 max-w-sm text-center text-sm text-slate-600">
                  We couldn't find any technologies matching your current filters. Try adjusting your search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
