import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { demoUsers } from '@/data/users';
import { researchArticles } from '@/data/research';
import { useAuth } from '@/hooks/useAuth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Users,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Eye,
  ArrowRight,
  Activity,
  UserCheck,
  Stethoscope,
} from 'lucide-react';

const patientUsers = demoUsers.filter((u) => u.role === 'individual');

const outcomeData = [
  { week: 'Week 1', 'Sarah Chen': 32, 'Marcus Williams': 40, 'James Thompson': 28 },
  { week: 'Week 2', 'Sarah Chen': 38, 'Marcus Williams': 44, 'James Thompson': 35 },
  { week: 'Week 3', 'Sarah Chen': 47, 'Marcus Williams': 52, 'James Thompson': 43 },
  { week: 'Week 4', 'Sarah Chen': 55, 'Marcus Williams': 58, 'James Thompson': 50 },
  { week: 'Week 5', 'Sarah Chen': 63, 'Marcus Williams': 65, 'James Thompson': 59 },
  { week: 'Week 6', 'Sarah Chen': 72, 'Marcus Williams': 71, 'James Thompson': 68 },
];

const summaryCards = [
  { label: 'My Patients', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Assessments', value: '8', icon: ClipboardCheck, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Outcomes Improved', value: '24', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Reports Generated', value: '15', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const quickActions = [
  { label: 'Review Assessment', icon: ClipboardCheck, link: '/assessment', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: 'Generate Report', icon: FileText, link: '/technologies', color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
  { label: 'View Outcomes', icon: TrendingUp, link: '/progress', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { label: 'Manage Patients', icon: Users, link: '/technologies', color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
];

const statusBadge: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-slate-100 text-slate-600',
};

export default function ProfessionalDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <Stethoscope className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                Welcome, {user?.name ?? 'Dr. Blake'}
              </h1>
              <p className="text-sm text-text-secondary">Professional Dashboard</p>
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

        {/* Recent Patient Activity */}
        <div className="mb-10 rounded-xl border border-surface-border bg-white">
          <div className="border-b border-surface-border px-6 py-4">
            <h2 className="text-lg font-semibold text-text-primary">Recent Patient Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Assessments
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientUsers.map((u) => (
                  <tr
                    key={u.email}
                    className="border-b border-surface-border last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                          {u.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{u.name}</p>
                          <p className="text-xs text-text-secondary">{u.email}</p>
                        </div>
                      </div>
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
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-primary">
                      {u.assessments}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        to="/assessment"
                        className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          {/* Outcome Trends */}
          <div className="rounded-xl border border-surface-border bg-white p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Outcome Trends</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outcomeData}>
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
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="Sarah Chen" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Marcus Williams" stroke="#0891b2" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="James Thompson" stroke="#16a34a" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {[
                { label: 'Sarah Chen', color: 'bg-blue-500' },
                { label: 'Marcus Williams', color: 'bg-cyan-500' },
                { label: 'James Thompson', color: 'bg-green-500' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', l.color)} />
                  <span className="text-xs text-text-secondary">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    action.color
                  )}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                  <ArrowRight className="ml-auto h-4 w-4 opacity-60" />
                </Link>
              ))}
            </div>

            {/* Research Summary */}
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Research Library
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{researchArticles.length}</p>
              <p className="text-xs text-text-secondary">Articles available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
