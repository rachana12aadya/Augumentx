import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  Beaker,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { researchArticles } from '@/data/research';
import type { TechnologyCategory, EvidenceLevel } from '@/types';

const CATEGORIES: { value: TechnologyCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'assistive', label: 'Assistive Living' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'sports', label: 'Sports' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'emerging', label: 'Emerging' },
];

const EVIDENCE_LEVELS: { value: EvidenceLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'early', label: 'Early' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
];

const YEARS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  emerging: 'bg-gray-100 text-gray-700',
  early: 'bg-yellow-100 text-yellow-700',
  moderate: 'bg-blue-100 text-blue-700',
  strong: 'bg-green-100 text-green-700',
};

const EVIDENCE_BORDER_COLORS: Record<EvidenceLevel, string> = {
  emerging: 'border-l-gray-400',
  early: 'border-l-yellow-400',
  moderate: 'border-l-blue-400',
  strong: 'border-l-green-500',
};

const CATEGORY_COLORS: Record<TechnologyCategory, string> = {
  healthcare: 'bg-blue-50 text-blue-700',
  assistive: 'bg-green-50 text-green-700',
  industrial: 'bg-orange-50 text-orange-700',
  sports: 'bg-purple-50 text-purple-700',
  mobility: 'bg-teal-50 text-teal-700',
  emerging: 'bg-pink-50 text-pink-700',
};

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      )}
    >
      {label}
    </button>
  );
}

interface FilterSectionProps {
  title: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

function FilterSection({ title, options, selected, onSelect }: FilterSectionProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            active={selected === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface ResearchCardProps {
  article: typeof researchArticles[0];
}

function ResearchCard({ article }: ResearchCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={cn(
        'rounded-xl border border-slate-200 border-l-4 bg-white shadow-sm transition-all hover:shadow-md',
        EVIDENCE_BORDER_COLORS[article.evidence]
      )}
    >
      <div className="p-5 sm:p-6">
        {/* Top badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            Demo Research
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            <Calendar className="h-3 w-3" />
            {article.year}
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', CATEGORY_COLORS[article.category])}>
            {article.category}
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', EVIDENCE_COLORS[article.evidence])}>
            {article.evidence} evidence
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
          {article.title}
        </h3>

        {/* Technology */}
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <Beaker className="h-3.5 w-3.5" />
          {article.technology}
        </p>

        {/* Summary */}
        <div className="mt-3">
          <p
            className={cn(
              'text-sm leading-relaxed text-slate-600',
              !expanded && 'line-clamp-3'
            )}
          >
            {article.summary}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Research() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TechnologyCategory | 'all'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceLevel | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    return researchArticles.filter((article) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          article.title.toLowerCase().includes(query) ||
          article.technology.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
      if (selectedEvidence !== 'all' && article.evidence !== selectedEvidence) return false;
      if (selectedYear !== 'all' && article.year !== Number(selectedYear)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedEvidence, selectedYear]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedEvidence !== 'all' ||
    selectedYear !== 'all';

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedEvidence('all');
    setSelectedYear('all');
  }, []);

  const filtersPanel = (
    <div className="space-y-5">
      <FilterSection
        title="Category"
        options={CATEGORIES}
        selected={selectedCategory}
        onSelect={(v) => setSelectedCategory(v as TechnologyCategory | 'all')}
      />
      <FilterSection
        title="Evidence Level"
        options={EVIDENCE_LEVELS}
        selected={selectedEvidence}
        onSelect={(v) => setSelectedEvidence(v as EvidenceLevel | 'all')}
      />
      <FilterSection
        title="Year"
        options={YEARS}
        selected={selectedYear}
        onSelect={setSelectedYear}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Human Augmentation Research
                </h1>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  Demo Research
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-lg text-slate-600">
                Explore the evidence base behind augmentation technologies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Mobile Filter Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search research articles..."
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
            {filtersPanel}
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                Search: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}>
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
            {selectedEvidence !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 capitalize">
                {selectedEvidence} evidence
                <button type="button" onClick={() => setSelectedEvidence('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                {selectedYear}
                <button type="button" onClick={() => setSelectedYear('all')}>
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
              {filtersPanel}
            </div>
          </aside>

          {/* Research Articles */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                Showing{' '}
                <span className="font-semibold text-slate-900">{filteredArticles.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{researchArticles.length}</span>{' '}
                articles
              </p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <ResearchCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16">
                <div className="mb-4 text-6xl">📄</div>
                <h3 className="text-lg font-semibold text-slate-900">
                  No research articles match your filters
                </h3>
                <p className="mt-2 max-w-sm text-center text-sm text-slate-600">
                  Try adjusting your search or filter criteria to find relevant research.
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
