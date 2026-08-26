import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/services/storage';
import { technologies } from '@/data/technologies';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Zap,
  BarChart3,
  Cpu,
  CalendarClock,
  ArrowRight,
  CheckCircle,
  Plus,
  TrendingUp,
  Eye,
  ClipboardList,
  ChevronRight,
  Target,
  Compass,
  LayoutDashboard,
} from 'lucide-react';

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const chartData = [
  { week: 'W1', progress: 20 },
  { week: 'W2', progress: 32 },
  { week: 'W3', progress: 41 },
  { week: 'W4', progress: 53 },
  { week: 'W5', progress: 60 },
  { week: 'W6', progress: 68 },
];

const activityItems = [
  {
    icon: CheckCircle,
    iconClass: 'text-green-500 bg-green-50',
    text: 'Assessment completed',
    time: '2 days ago',
  },
  {
    icon: Plus,
    iconClass: 'text-blue-500 bg-blue-50',
    text: 'Added FlexStep Assist to plan',
    time: '2 days ago',
  },
  {
    icon: TrendingUp,
    iconClass: 'text-cyan-500 bg-cyan-50',
    text: 'Progress measurement updated',
    time: '1 day ago',
  },
  {
    icon: Eye,
    iconClass: 'text-amber-500 bg-amber-50',
    text: 'Viewed NeuroStep Trainer',
    time: '1 day ago',
  },
  {
    icon: ClipboardList,
    iconClass: 'text-violet-500 bg-violet-50',
    text: 'Started new assessment',
    time: '3 days ago',
  },
];

const quickActions = [
  {
    icon: ClipboardList,
    title: 'Continue Assessment',
    desc: 'Pick up where you left off',
    to: '/assessment',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Compass,
    title: 'Explore Technologies',
    desc: 'Browse the full library',
    to: '/technologies',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Update Progress',
    desc: 'Log new measurements',
    to: '/progress',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: LayoutDashboard,
    title: 'View My Plan',
    desc: 'Manage your tech plan',
    to: '/my-plan',
    color: 'bg-violet-50 text-violet-600',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const plan = useMemo(() => storage.getPlan(), []);
  const activePlan = useMemo(() => plan.filter((p) => p.status === 'active'), [plan]);
  const avgProgress = useMemo(() => {
    if (plan.length === 0) return 0;
    return Math.round(plan.reduce((sum, p) => sum + p.progress, 0) / plan.length);
  }, [plan]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Target className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-text-primary">
          Welcome to your Dashboard
        </h1>
        <p className="mb-8 max-w-md text-text-secondary">
          Log in to view your personalized augmentation journey, track progress, and manage
          your plan.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl"
        >
          Log In
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0] || 'Alex';
  const currentGoal = activePlan.length > 0 ? activePlan[0] : null;
  const recommended = technologies.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* ─── GREETING ─── */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {getTimeGreeting()}, {firstName}
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Here's how your augmentation journey is progressing.
        </p>
      </section>

      {/* ─── SUMMARY CARDS ─── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Active Plan',
            value: activePlan.length,
            icon: Zap,
            accent: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Overall Progress',
            value: `${avgProgress}%`,
            icon: BarChart3,
            accent: 'bg-green-50 text-green-600',
          },
          {
            label: 'Technologies Saved',
            value: plan.length,
            icon: Cpu,
            accent: 'bg-cyan-50 text-cyan-600',
          },
          {
            label: 'Next Check-in',
            value: 'In 3 days',
            icon: CalendarClock,
            accent: 'bg-violet-50 text-violet-600',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-xl border border-surface-border bg-white p-5 shadow-sm"
          >
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                card.accent
              )}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">{card.label}</p>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── TWO-COLUMN MAIN CONTENT ─── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN (2/3) */}
        <div className="space-y-8 lg:col-span-2">
          {/* ─── CURRENT GOAL ─── */}
          <section className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Current Goal</h2>
              <Link
                to="/progress"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {currentGoal ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <Target className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{currentGoal.goal}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">
                      {currentGoal.baseline} → {currentGoal.target}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-semibold text-primary-600">
                      {currentGoal.progress}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                      style={{ width: `${currentGoal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Mini chart */}
                <div className="h-36 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-10 text-center">
                <Target className="mb-3 h-8 w-8 text-slate-300" />
                <p className="mb-1 text-sm font-medium text-text-primary">
                  No active goals yet
                </p>
                <p className="mb-4 text-sm text-text-secondary">
                  Complete an assessment to get personalized recommendations.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-700"
                >
                  Start Assessment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>

          {/* ─── RECOMMENDED FOR YOU ─── */}
          <section className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Recommended for You
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {recommended.map((tech) => (
                <div
                  key={tech.id}
                  className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-primary-200 hover:bg-white"
                >
                  <span className="mb-2 inline-block w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 capitalize">
                    {tech.category}
                  </span>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary">
                    {tech.name}
                  </h3>
                  <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-text-secondary">
                    {tech.shortDescription}
                  </p>
                  <Link
                    to={`/technologies/${tech.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-8">
          {/* ─── RECENT ACTIVITY ─── */}
          <section className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {activityItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      item.iconClass
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{item.text}</p>
                    <p className="text-xs text-text-secondary">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── QUICK ACTIONS ─── */}
          <section className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group flex flex-col rounded-lg border border-slate-100 p-4 transition-all hover:border-primary-200 hover:shadow-sm"
                >
                  <div
                    className={cn(
                      'mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
                      action.color
                    )}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">{action.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
