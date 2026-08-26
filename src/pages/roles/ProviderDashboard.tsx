import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { technologies } from '@/data/technologies';
import { researchArticles } from '@/data/research';
import { useAuth } from '@/hooks/useAuth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  Cpu,
  Users,
  Star,
  CreditCard,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Package,
  ChevronRight,
} from 'lucide-react';

const techPerformanceData = [
  { name: 'FlexStep Assist', usage: 142, revenue: 28400 },
  { name: 'ErgoLift', usage: 98, revenue: 14700 },
  { name: 'BalanceSense', usage: 76, revenue: 19000 },
];

const monthlyEngagement = [
  { month: 'Jan', users: 180 },
  { month: 'Feb', users: 210 },
  { month: 'Mar', users: 245 },
  { month: 'Apr', users: 278 },
  { month: 'May', users: 310 },
  { month: 'Jun', users: 342 },
];

const summaryCards = [
  { label: 'Technologies Listed', value: '5', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Users', value: '342', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Avg Rating', value: '4.6', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Active Plans', value: '89', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
];

const listedTechnologies = technologies.slice(0, 4);

const techMetrics = [
  { activeUsers: 142, installs: 189, satisfaction: 94 },
  { activeUsers: 98, installs: 134, satisfaction: 91 },
  { activeUsers: 76, installs: 112, satisfaction: 88 },
  { activeUsers: 64, installs: 95, satisfaction: 92 },
];

export default function ProviderDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <Cpu className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                Welcome, {user?.name ?? 'TechCare Inc.'}
              </h1>
              <p className="text-sm text-text-secondary">Provider Dashboard</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-surface-border bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{card.label}</span>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', card.bg)}>
                  <card.icon className={cn('h-4 w-4', card.color)} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-text-primary">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* Technology Performance */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Technology Performance</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techPerformanceData} barSize={40}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="usage" fill="#2563eb" radius={[6, 6, 0, 0]} name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Engagement */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">User Engagement</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEngagement}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2563eb' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>+90% growth over 6 months</span>
            </div>
          </div>
        </div>

        {/* Listed Technologies */}
        <div className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Listed Technologies</h2>
            </div>
            <Link
              to="/technologies"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listedTechnologies.map((tech, i) => {
              const metrics = techMetrics[i];
              return (
                <div
                  key={tech.id}
                  className="rounded-xl border border-surface-border bg-white p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                      <Cpu className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary">{tech.name}</h3>
                  <p className="mb-4 text-xs text-text-secondary">{tech.shortDescription}</p>
                  <div className="space-y-2 border-t border-surface-border pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Active Users</span>
                      <span className="font-semibold text-text-primary">{metrics.activeUsers}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Installs</span>
                      <span className="font-semibold text-text-primary">{metrics.installs}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Satisfaction</span>
                      <span className="font-semibold text-green-600">{metrics.satisfaction}%</span>
                    </div>
                  </div>
                  <Link
                    to={`/technologies/${tech.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-slate-100"
                  >
                    View Details <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research & Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-surface-border bg-white p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Revenue by Technology</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techPerformanceData} barSize={50}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#0891b2" radius={[6, 6, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Quick Stats</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Research Citations
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{researchArticles.length}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Avg Response Time
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{'< 24h'}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Support Tickets Open
                </p>
                <p className="mt-1 text-2xl font-bold text-text-primary">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
