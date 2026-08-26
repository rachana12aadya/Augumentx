import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Target, Trash2, Eye, Edit3, CheckCircle2, PauseCircle, PlayCircle, Save, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/services/storage';
import { getTechnologyById } from '@/data/technologies';
import { useToast } from '@/hooks/useToast';
import type { PlanItem } from '@/types';

const statusConfig = {
  active: { label: 'Active', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  paused: { label: 'Paused', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: PauseCircle },
} as const;

export default function MyPlan() {
  const { addToast } = useToast();
  const [planItems, setPlanItems] = useState<PlanItem[]>(() => storage.getPlan());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ goal: string; baseline: string; target: string; progress: number }>({
    goal: '',
    baseline: '',
    target: '',
    progress: 0,
  });

  const totalTechs = planItems.length;
  const activePlans = planItems.filter((i) => i.status === 'active').length;
  const avgProgress = totalTechs > 0 ? Math.round(planItems.reduce((sum, i) => sum + i.progress, 0) / totalTechs) : 0;

  const updatePlan = (updated: PlanItem[]) => {
    setPlanItems(updated);
    storage.setPlan(updated);
  };

  const startEditing = (item: PlanItem) => {
    setEditingId(item.id);
    setEditValues({ goal: item.goal, baseline: item.baseline, target: item.target, progress: item.progress });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    const updated = planItems.map((item) => (item.id === id ? { ...item, ...editValues } : item));
    updatePlan(updated);
    setEditingId(null);
    addToast('Progress updated successfully.', 'success');
  };

  const removeItem = (id: string) => {
    const updated = planItems.filter((item) => item.id !== id);
    updatePlan(updated);
    addToast('Technology removed from your plan.', 'info');
  };

  const changeStatus = (id: string, status: PlanItem['status']) => {
    const updated = planItems.map((item) => (item.id === id ? { ...item, status } : item));
    updatePlan(updated);
    const config = statusConfig[status];
    addToast(`Marked as ${config.label.toLowerCase()}.`, 'success');
  };

  if (totalTechs === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg animate-fade-in">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-8">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Build Your First Augmentation Plan</h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Add technologies from our library or get personalized recommendations to start your augmentation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/technologies"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Explore Technologies
            </Link>
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Augmentation Plan</h1>
        <p className="text-gray-500 text-lg">Manage your technology plans and track your goals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Technologies', value: totalTechs, accent: 'from-indigo-500 to-indigo-600' },
          { label: 'Active Plans', value: activePlans, accent: 'from-blue-500 to-blue-600' },
          { label: 'Avg. Progress', value: `${avgProgress}%`, accent: 'from-emerald-500 to-emerald-600' },
        ].map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] bg-gradient-to-br opacity-10', card.accent)} />
            <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {planItems.map((item) => {
          const tech = getTechnologyById(item.technologyId);
          const isEditing = editingId === item.id;
          const status = statusConfig[item.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">{tech?.name ?? 'Unknown Technology'}</h3>
                    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border', status.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['active', 'completed', 'paused'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(item.id, s)}
                        disabled={item.status === s}
                        className={cn(
                          'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                          item.status === s
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        )}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4 bg-gray-50 rounded-xl p-5 mb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Goal</label>
                        <input
                          type="text"
                          value={editValues.goal}
                          onChange={(e) => setEditValues((v) => ({ ...v, goal: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Baseline</label>
                        <input
                          type="text"
                          value={editValues.baseline}
                          onChange={(e) => setEditValues((v) => ({ ...v, baseline: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Target</label>
                        <input
                          type="text"
                          value={editValues.target}
                          onChange={(e) => setEditValues((v) => ({ ...v, target: e.target.value }))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Progress — {editValues.progress}%
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={editValues.progress}
                        onChange={(e) => setEditValues((v) => ({ ...v, progress: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-medium text-gray-400 mb-0.5">Goal</p>
                      <p className="text-sm text-gray-800 font-medium">{item.goal || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-medium text-gray-400 mb-0.5">Baseline</p>
                      <p className="text-sm text-gray-800 font-medium">{item.baseline || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-medium text-gray-400 mb-0.5">Target</p>
                      <p className="text-sm text-gray-800 font-medium">{item.target || '—'}</p>
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">Progress</span>
                      <span className="text-xs font-bold text-gray-700">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          item.progress === 100 ? 'bg-green-500' : item.progress >= 50 ? 'bg-indigo-500' : 'bg-amber-400'
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" /> Update Progress
                      </button>
                      <Link
                        to={`/technologies/${item.technologyId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <Eye className="w-4 h-4" /> View Technology
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" /> Remove from Plan
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
