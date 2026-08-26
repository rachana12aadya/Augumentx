import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { technologies } from '@/data/technologies';
import {
  Activity,
  Accessibility,
  Factory,
  Wrench,
  Trophy,
  Navigation,
  Move,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const progressData = [
  { week: 'Week 1', Mobility: 42, Endurance: 35, Balance: 50 },
  { week: 'Week 2', Mobility: 48, Endurance: 40, Balance: 55 },
  { week: 'Week 3', Mobility: 55, Endurance: 47, Balance: 62 },
  { week: 'Week 4', Mobility: 60, Endurance: 52, Balance: 70 },
  { week: 'Week 5', Mobility: 66, Endurance: 58, Balance: 76 },
  { week: 'Week 6', Mobility: 72, Endurance: 64, Balance: 81 },
];

const featuredTechnologies = technologies.slice(0, 6);

const categories = [
  {
    title: 'Healthcare & Rehabilitation',
    icon: Activity,
    description: 'Robotics, exoskeletons, prosthetics and rehabilitation technologies.',
    link: '/technologies?category=healthcare',
  },
  {
    title: 'Assistive Living',
    icon: Accessibility,
    description: 'Technologies designed to increase independence and accessibility.',
    link: '/technologies?category=assistive',
  },
  {
    title: 'Industrial Ergonomics',
    icon: Factory,
    description: 'Solutions that reduce physical workload and support safer movement.',
    link: '/technologies?category=industrial',
  },
  {
    title: 'Sports & Performance',
    icon: Trophy,
    description: 'Wearables and augmentation technologies for performance and recovery.',
    link: '/technologies?category=sports',
  },
  {
    title: 'Personal Mobility',
    icon: Navigation,
    description: 'Advanced technologies supporting movement and mobility.',
    link: '/technologies?category=mobility',
  },
  {
    title: 'Emerging Technologies',
    icon: Sparkles,
    description: 'Next-generation human augmentation technologies.',
    link: '/technologies?category=emerging',
  },
];

const steps = [
  {
    number: '01',
    title: 'Assess',
    description: 'Understand your goals and functional needs.',
  },
  {
    number: '02',
    title: 'Discover',
    description: 'Explore relevant augmentation technologies.',
  },
  {
    number: '03',
    title: 'Match',
    description: 'Receive explainable technology recommendations.',
  },
  {
    number: '04',
    title: 'Measure',
    description: 'Track whether your technology is helping you progress.',
  },
];

const metrics = [
  { label: 'Mobility', value: 72, color: '#2563eb' },
  { label: 'Endurance', value: 64, color: '#0891b2' },
  { label: 'Balance', value: 81, color: '#16a34a' },
];

const evidenceColors: Record<string, string> = {
  strong: 'bg-green-100 text-green-700',
  moderate: 'bg-blue-100 text-blue-700',
  early: 'bg-amber-100 text-amber-700',
  emerging: 'bg-purple-100 text-purple-700',
};

const categoryGradients = [
  'from-primary-100 to-primary-200',
  'from-cyan-100 to-cyan-200',
  'from-amber-100 to-amber-200',
  'from-emerald-100 to-emerald-200',
  'from-violet-100 to-violet-200',
  'from-rose-100 to-rose-200',
];

const categoryIcons = [Activity, Accessibility, Wrench, Trophy, Move, Lightbulb];

function CircularProgress({ value, color, size = 120, strokeWidth = 8 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function HumanSilhouette() {
  return (
    <div className="relative h-[480px] w-[280px]">
      <svg viewBox="0 0 200 440" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="100" y1="0" x2="100" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="strokeGrad" x1="100" y1="0" x2="100" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Head */}
        <ellipse cx="100" cy="36" rx="26" ry="30" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Neck */}
        <rect x="88" y="66" width="24" height="18" rx="6" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Torso */}
        <path d="M60 84 Q60 80 66 80 L134 80 Q140 80 140 84 L142 200 Q142 210 134 212 L66 212 Q58 210 58 200 Z" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Left arm */}
        <path d="M60 88 Q40 90 36 120 L30 180 Q28 192 36 194 L44 192 Q48 190 50 180 L56 120 Q58 100 62 92" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Right arm */}
        <path d="M140 88 Q160 90 164 120 L170 180 Q172 192 164 194 L156 192 Q152 190 150 180 L144 120 Q142 100 138 92" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Left leg */}
        <path d="M66 212 L60 340 Q58 360 54 370 L48 420 Q46 432 56 434 L72 432 Q78 430 76 420 L80 340 L86 212" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
        {/* Right leg */}
        <path d="M134 212 L140 340 Q142 360 146 370 L152 420 Q154 432 144 434 L128 432 Q122 430 124 420 L120 340 L114 212" fill="url(#bodyGrad)" stroke="url(#strokeGrad)" strokeWidth="1.5" />
      </svg>

      {/* Marker points with labels and pulses */}
      {[
        { label: 'Mobility', x: '28%', y: '72%', delay: '0s' },
        { label: 'Strength', x: '78%', y: '38%', delay: '0.5s' },
        { label: 'Balance', x: '50%', y: '52%', delay: '1s' },
        { label: 'Dexterity', x: '12%', y: '42%', delay: '1.5s' },
        { label: 'Rehabilitation', x: '85%', y: '65%', delay: '2s' },
        { label: 'Performance', x: '50%', y: '16%', delay: '2.5s' },
      ].map((marker) => (
        <div
          key={marker.label}
          className="absolute flex items-center gap-2"
          style={{ left: marker.x, top: marker.y }}
        >
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"
              style={{ animationDelay: marker.delay, animationDuration: '3s' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-primary-600">
            {marker.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="animate-slide-up space-y-8">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                Augment Human Potential.{' '}
                <span className="text-gradient">Improve Quality of Life.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-text-secondary">
                Discover technologies that restore capability, improve performance, increase
                independence, and support better human outcomes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/assessment')}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30"
                >
                  Start Assessment
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/technologies"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-surface-border px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-primary-300 hover:bg-primary-50"
                >
                  Explore Technologies
                </Link>
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <HumanSilhouette />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Explore Human Augmentation
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Browse technologies across every dimension of human performance and rehabilitation.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.link}
                to={cat.link}
                className="card-hover group rounded-xl border border-surface-border bg-white p-7"
              >
                <div className={cn('mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50', `animate-slide-up`)}>
                  <cat.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {cat.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 transition-all group-hover:opacity-100">
                  Explore <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              How AugmentX Works
            </h2>
          </div>
          <div className="relative grid gap-8 md:grid-cols-4 md:gap-4">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-primary-200 md:block" />

            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white shadow-lg shadow-primary-600/20">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED TECHNOLOGIES ─── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Featured Technologies
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Evidence-based technologies to support your goals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTechnologies.map((tech, i) => {
              const Icon = categoryIcons[i] || Activity;
              return (
                <div
                  key={tech.id}
                  className="card-hover group overflow-hidden rounded-xl border border-surface-border bg-white"
                >
                  <div className={cn('flex h-44 items-center justify-center bg-gradient-to-br', categoryGradients[i % categoryGradients.length])}>
                    <Icon className="h-16 w-16 text-white/70" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 capitalize">
                        {tech.category}
                      </span>
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', evidenceColors[tech.evidence])}>
                        {tech.evidence} evidence
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {tech.shortDescription}
                    </p>
                    <Link
                      to={`/technologies/${tech.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View Details <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── OUTCOME TRACKING ─── */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Track Your Progress
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Monitor measurable improvements across key dimensions of human performance.
            </p>
          </div>

          {/* Metric cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center rounded-xl border border-surface-border bg-white p-8 text-center">
                <div className="relative mb-4">
                  <CircularProgress value={m.value} color={m.color} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-text-primary">{m.value}%</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-text-secondary">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Line chart */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-semibold text-text-primary">Improvement Over 6 Weeks</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
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
                  <Line type="monotone" dataKey="Mobility" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Endurance" stroke="#0891b2" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Balance" stroke="#16a34a" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {[
                { label: 'Mobility', color: 'bg-primary-500' },
                { label: 'Endurance', color: 'bg-cyan-500' },
                { label: 'Balance', color: 'bg-green-500' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', l.color)} />
                  <span className="text-xs text-text-secondary">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700"
            >
              Track Your Progress
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            What could you achieve with the right augmentation?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
            Explore technologies matched to your goals and discover new possibilities.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-primary-700 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl"
          >
            Start Your Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
