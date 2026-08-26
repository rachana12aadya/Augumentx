import { useState, useEffect } from 'react';
import {
  User,
  Save,
  Trash2,
  Bell,
  Shield,
  Target,
  Settings,
  Check,
  Footprints,
  Dumbbell,
  Scale,
  Timer,
  Hand,
  Wrench,
  Briefcase,
  Trophy,
  HeartPulse,
  Feather,
  Watch,
  EyeOff,
  Power,
  Sparkles,
  Maximize2,
  Expand,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import type { UserProfile } from '@/types';

interface ChipOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const GOAL_OPTIONS: ChipOption[] = [
  { key: 'mobility', label: 'Mobility', icon: Footprints },
  { key: 'strength', label: 'Strength', icon: Dumbbell },
  { key: 'balance', label: 'Balance', icon: Scale },
  { key: 'endurance', label: 'Endurance', icon: Timer },
  { key: 'dexterity', label: 'Dexterity', icon: Hand },
  { key: 'rehabilitation', label: 'Rehabilitation', icon: Wrench },
  { key: 'ergonomics', label: 'Workplace ergonomics', icon: Briefcase },
  { key: 'sports', label: 'Sports performance', icon: Trophy },
  { key: 'independence', label: 'Independence', icon: HeartPulse },
];

const PREFERENCE_OPTIONS: ChipOption[] = [
  { key: 'lightweight', label: 'Lightweight', icon: Feather },
  { key: 'wearable', label: 'Wearable', icon: Watch },
  { key: 'discreet', label: 'Discreet', icon: EyeOff },
  { key: 'powered', label: 'Powered', icon: Power },
  { key: 'passive', label: 'Passive', icon: Shield },
  { key: 'easy', label: 'Easy to use', icon: Sparkles },
  { key: 'maximum', label: 'Maximum assistance', icon: Maximize2 },
  { key: 'freedom', label: 'Freedom of movement', icon: Expand },
];

const ROLE_LABELS: Record<string, string> = {
  individual: 'Individual',
  professional: 'Healthcare Professional',
  provider: 'Technology Provider',
  admin: 'Administrator',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-text-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
          checked ? 'bg-primary-600' : 'bg-surface-muted',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}

function ChipSelect({
  options,
  selected,
  onToggle,
}: {
  options: ChipOption[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = selected.includes(opt.key);
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onToggle(opt.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
              active
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-surface-border bg-surface-card text-text-secondary hover:border-primary-200 hover:text-text-primary',
            )}
          >
            <Icon size={14} />
            {opt.label}
            {active && <Check size={14} className="text-primary-500" />}
          </button>
        );
      })}
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
          <Icon size={20} className="text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  disabled,
  type = 'text',
}: {
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        'w-full rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-text-primary outline-none transition-colors',
        'placeholder:text-text-muted',
        'focus:border-primary-400 focus:ring-2 focus:ring-primary-100',
        disabled && 'cursor-not-allowed bg-surface-muted text-text-muted',
      )}
    />
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = getInitials(name);
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full text-lg font-bold text-white shadow-md',
        className,
      )}
      style={{ backgroundColor: `hsl(${hue}, 60%, 45%)` }}
    >
      {initials}
    </div>
  );
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  role: 'individual',
  goals: [],
  preferences: [],
  notifications: {
    email: true,
    progress: true,
    recommendations: true,
  },
};

export default function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = storage.getProfile();
    if (saved) {
      setProfile(saved);
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
    }
    setMounted(true);
  }, [user]);

  function toggleArrayItem(arr: string[], key: string): string[] {
    return arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
  }

  function handleSave() {
    storage.setProfile(profile);
    addToast('Profile saved successfully!', 'success');
  }

  function handleClearData() {
    storage.clearAll();
    setProfile({
      ...DEFAULT_PROFILE,
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'individual',
    });
    addToast('All data cleared.', 'info');
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── HEADER ─── */}
      <div className="mb-10 flex items-center gap-5 animate-fade-in">
        <Avatar name={profile.name || 'User'} className="h-16 w-16 text-xl flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your account and preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ─── PERSONAL INFORMATION ─── */}
        <Card icon={User} title="Personal Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={profile.name}
                onChange={(val) => setProfile((p) => ({ ...p, name: val }))}
              />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput value={profile.email} disabled />
            </div>
          </div>
          <div className="mt-4">
            <FieldLabel>Role</FieldLabel>
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-muted px-4 py-2.5">
              <Settings size={14} className="text-text-muted" />
              <span className="text-sm text-text-secondary">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </div>
          </div>
        </Card>

        {/* ─── GOALS ─── */}
        <Card icon={Target} title="Goals">
          <p className="mb-3 text-sm text-text-muted">
            Select all that apply — these help tailor your experience.
          </p>
          <ChipSelect
            options={GOAL_OPTIONS}
            selected={profile.goals}
            onToggle={(key) =>
              setProfile((p) => ({ ...p, goals: toggleArrayItem(p.goals, key) }))
            }
          />
        </Card>

        {/* ─── PREFERENCES ─── */}
        <Card icon={Settings} title="Technology Preferences">
          <p className="mb-3 text-sm text-text-muted">
            What matters most to you in a technology solution?
          </p>
          <ChipSelect
            options={PREFERENCE_OPTIONS}
            selected={profile.preferences}
            onToggle={(key) =>
              setProfile((p) => ({
                ...p,
                preferences: toggleArrayItem(p.preferences, key),
              }))
            }
          />
        </Card>

        {/* ─── NOTIFICATIONS ─── */}
        <Card icon={Bell} title="Notifications">
          <div className="divide-y divide-surface-border">
            <Toggle
              checked={profile.notifications.email}
              onChange={(val) =>
                setProfile((p) => ({
                  ...p,
                  notifications: { ...p.notifications, email: val },
                }))
              }
              label="Email notifications"
              description="Receive updates and alerts via email"
            />
            <Toggle
              checked={profile.notifications.progress}
              onChange={(val) =>
                setProfile((p) => ({
                  ...p,
                  notifications: { ...p.notifications, progress: val },
                }))
              }
              label="Progress updates"
              description="Get notified when your metrics improve"
            />
            <Toggle
              checked={profile.notifications.recommendations}
              onChange={(val) =>
                setProfile((p) => ({
                  ...p,
                  notifications: { ...p.notifications, recommendations: val },
                }))
              }
              label="Recommendations"
              description="Receive personalized technology suggestions"
            />
          </div>
        </Card>

        {/* ─── PRIVACY ─── */}
        <Card icon={Shield} title="Privacy">
          <div className="rounded-lg bg-surface-muted p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="mt-0.5 flex-shrink-0 text-accent-600" />
              <div>
                <p className="text-sm font-medium text-text-primary">Local Storage Only</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  Your data is stored locally in your browser. No data is sent to external
                  servers in this demo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-text-primary">Data Management</p>
            <p className="mb-3 text-xs text-text-muted">
              Permanently delete all locally stored data including your profile, assessment
              results, and progress.
            </p>
            <button
              type="button"
              onClick={handleClearData}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>
        </Card>
      </div>

      {/* ─── SAVE BUTTON ─── */}
      <div className="mt-8 flex justify-end border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-[0.98]"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
