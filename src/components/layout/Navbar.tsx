import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  name: string;
  email: string;
  role: 'individual' | 'professional' | 'provider' | 'admin';
}

interface NavbarProps {
  user: User | null;
}

const navByRole: Record<User['role'], { label: string; to: string }[]> = {
  individual: [
    { label: 'Home', to: '/' },
    { label: 'Technologies', to: '/technologies' },
    { label: 'Assessment', to: '/assessment' },
    { label: 'Research', to: '/research' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  professional: [
    { label: 'Dashboard', to: '/professional' },
    { label: 'Users', to: '/professional/users' },
    { label: 'Assessments', to: '/professional/assessments' },
    { label: 'Outcomes', to: '/professional/outcomes' },
    { label: 'Reports', to: '/professional/reports' },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider' },
    { label: 'Technologies', to: '/provider/technologies' },
    { label: 'Analytics', to: '/provider/analytics' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Technologies', to: '/admin/technologies' },
    { label: 'Research', to: '/admin/research' },
    { label: 'Analytics', to: '/admin/analytics' },
  ],
};

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? navByRole[user.role] : navByRole.individual;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
          AugmentX
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right section */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <User className="h-4 w-4" />
                {user.name}
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <User className="h-4 w-4" />
                My Plan
              </Link>
              <Link
                to="/assessment"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Start Assessment
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-slate-900 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-slate-900',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 px-4 py-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4" />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  My Plan
                </Link>
                <Link
                  to="/assessment"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Start Assessment
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
