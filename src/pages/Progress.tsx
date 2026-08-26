import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  Footprints,
  Timer,
  Scale,
  HeartPulse,
  Dumbbell,
  Plus,
  X,
} from 'lucide-react';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import type { ProgressMeasurement } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts';

const METRIC_COLORS: Record<string, string> = {
  Mobility: '#2563eb',
  Endurance: '#0891b2',
  Balance: '#16a34a',
  Independence: '#9333ea',
};

const performanceData = [
  { week: 'Week 1', Mobility: 58, Endurance: 46, Balance: 70, Independence: 67 },
  { week: 'Week 2', Mobility: 62, Endurance: 50, Balance: 73, Independence: 69 },
  { week: 'Week 3', Mobility: 65, Endurance: 54, Balance: 75, Independence: 71 },
  { week: 'Week 4', Mobility: 68, Endurance: 58, Balance: 78, Independence: 73 },
  { week: 'Week 5', Mobility: 70, Endurance: 61, Balance: 80, Independence: 75 },
  { week: 'Week 6', Mobility: 72, Endurance: 64, Balance: 81, Independence: 76 },
];

const goalData = [
  { name: 'Mobility', Baseline: 58, Current: 72, Target: 85 },
  { name: 'Endurance', Baseline: 46, Current: 64, Target: 80 },
  { name: 'Balance', Baseline: 70, Current: 81, Target: 90 },
  { name: 'Independence', Baseline: 67, Current: 76, Target: 85 },
];

const METRIC_OPTIONS = ['Mobility', 'Endurance', 'Balance', 'Independence', 'Strength', 'Dexterity'] as const;

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

function MetricCard({ label, value, change, color, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}><Icon size={20} /></span>
        </div>
        <span className="text-xs font-medium text-green-600">+{change}% from baseline</span>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold text-text-primary">{value}%</span>
        <p className="mt-1 text-sm text-text-secondary">{label}</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-text-primary">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-medium text-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-surface-border bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-text-primary">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-medium text-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Progress() {
  const { addToast } = useToast();
  const [measurements, setMeasurements] = useState<ProgressMeasurement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    metric: METRIC_OPTIONS[0] as typeof METRIC_OPTIONS[number],
    value: '',
    unit: '%',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    setMeasurements(storage.getProgress());
  }, []);

  function handleSave() {
    const value = parseFloat(form.value);
    if (isNaN(value) || value <= 0) {
      addToast('Please enter a valid value', 'error');
      return;
    }

    const measurement: ProgressMeasurement = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      metric: form.metric,
      value,
      unit: form.unit || '%',
      date: form.date,
      note: form.note,
    };

    const updated = [...measurements, measurement];
    setMeasurements(updated);
    storage.setProgress(updated);
    addToast('Measurement recorded', 'success');
    setIsModalOpen(false);
    setForm({
      metric: METRIC_OPTIONS[0],
      value: '',
      unit: '%',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Your Progress</h1>
          <p className="mt-1 text-text-secondary">Track your augmentation journey over time</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Measurement
        </button>
      </div>

      {/* Metric Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Mobility" value={72} change={14} color={METRIC_COLORS.Mobility} icon={Footprints} />
        <MetricCard label="Endurance" value={64} change={18} color={METRIC_COLORS.Endurance} icon={Timer} />
        <MetricCard label="Balance" value={81} change={11} color={METRIC_COLORS.Balance} icon={Scale} />
        <MetricCard label="Independence" value={76} change={9} color={METRIC_COLORS.Independence} icon={HeartPulse} />
      </div>

      {/* Performance Over Time Chart */}
      <div className="mb-10 rounded-xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-text-primary">Performance Over Time</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {Object.entries(METRIC_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
              <Tooltip content={<AreaTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              {Object.keys(METRIC_COLORS).map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={METRIC_COLORS[key]}
                  strokeWidth={2.5}
                  fill={`url(#grad-${key})`}
                  dot={{ r: 3, fill: METRIC_COLORS[key] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Progress Chart */}
      <div className="mb-10 rounded-xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Activity size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-text-primary">Goal Progress</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
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
              <Tooltip content={<BarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Target" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Measurements Table */}
      <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Dumbbell size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-text-primary">Recent Measurements</h2>
        </div>
        {measurements.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">No measurements recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="pb-3 font-medium text-text-secondary">Date</th>
                  <th className="pb-3 font-medium text-text-secondary">Metric</th>
                  <th className="pb-3 font-medium text-text-secondary">Value</th>
                  <th className="pb-3 font-medium text-text-secondary">Unit</th>
                  <th className="pb-3 font-medium text-text-secondary">Note</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => (
                  <tr key={m.id} className="border-b border-surface-border last:border-0">
                    <td className="py-3 text-text-primary">{m.date}</td>
                    <td className="py-3 text-text-primary">{m.metric}</td>
                    <td className="py-3 font-medium text-text-primary">{m.value}</td>
                    <td className="py-3 text-text-secondary">{m.unit}</td>
                    <td className="py-3 text-text-secondary">{m.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Measurement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Add Measurement</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Metric</label>
                <select
                  value={form.metric}
                  onChange={(e) => setForm({ ...form, metric: e.target.value as typeof METRIC_OPTIONS[number] })}
                  className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  {METRIC_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Value</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="%"
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Optional note about this measurement"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-surface-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
