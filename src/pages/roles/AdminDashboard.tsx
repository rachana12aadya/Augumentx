import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { demoUsers } from '@/data/users';
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
  Shield,
  Users,
  Cpu,
  ClipboardCheck,
  FileText,
  ArrowRight,
  Activity,
  Server,
  Clock,
  Monitor,
  Settings,
  BookOpen,
  ChevronRight,
  TrendingUp,
  BarChart3,
  UserCheck,
} from 'lucide-react';

const usersByRole = [
  { role: 'Individual', count: 892 },
  { role: 'Professional', count: 156 },
  { role: 'Provider', count: 89 },
  { role: 'Admin', count: 10 },
];

const registrationsOverTime = [
  { month: 'Jan', registrations: 124 },
  { month: 'Feb', registrations: 156 },
  { month: 'Mar', registrations: 198 },
  { month: 'Apr', registrations: 245 },
  { month: 'May', registrations: 310 },
  { month: 'Jun', registrations: 389 },
];

const summaryCards = [
  { label: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Technologies', value: '12', icon: Cpu, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Assessments', value: '3,891', icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Research Articles', value: '12', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const roleBadgeColors: Record<string, string> = {
  individual: 'bg-blue-100 text-blue-700',
  professional: 'bg-emerald-100 text-emerald-700',
  provider: 'bg-amber-100 text-amber-700',
  admin: 'bg-red-100 text-red-700',
};

const statusBadge: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-slate-100 text-slate-600',
};

const systemHealth = [
  { label: 'Uptime', value: '99.9%', icon: Server, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Response Time', value: '45ms', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Sessions', value: '23', icon: Monitor, color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                Welcome, {user?.name ?? 'System Admin'}
              </h1>
              <p className="text-sm text-text-secondary">Administration Dashboard</p>
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
          {/* Users by Role */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Users by Role</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByRole} barSize={50}>
                  <XAxis
                    dataKey="role"
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
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registrations Over Time */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Registrations</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationsOverTime}>
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
                    dataKey="registrations"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2563eb' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="mb-10 rounded-xl border border-surface-border bg-white">
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">User Management</h2>
            </div>
            <Link
              to="/technologies"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Manage <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoUsers.map((u) => (
                  <tr
                    key={u.email}
                    className="border-b border-surface-border last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                          roleBadgeColors[u.role] ?? 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusBadge[u.status] ?? 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary">
                      {u.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Management & System Health */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Content Management */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Content Management</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/technologies"
                className="flex items-center justify-between rounded-lg border border-surface-border p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                    <Cpu className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Technologies</p>
                    <p className="text-xs text-text-secondary">{technologies.length} listed</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary" />
              </Link>
              <Link
                to="/technologies"
                className="flex items-center justify-between rounded-lg border border-surface-border p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                    <BookOpen className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Research Articles</p>
                    <p className="text-xs text-text-secondary">{researchArticles.length} published</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary" />
              </Link>
              <Link
                to="/assessment"
                className="flex items-center justify-between rounded-lg border border-surface-border p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <ClipboardCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Assessments</p>
                    <p className="text-xs text-text-secondary">Review & configure</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary" />
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-xl border border-surface-border bg-white p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">System Health</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {systemHealth.map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', item.bg)}>
                      <item.icon className={cn('h-5 w-5', item.color)} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-secondary">{item.label}</p>
                      <p className="text-xl font-bold text-text-primary">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700">All systems operational</span>
              </div>
              <p className="mt-1 text-xs text-green-600">
                Last checked: 2 minutes ago. No incidents in the last 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
