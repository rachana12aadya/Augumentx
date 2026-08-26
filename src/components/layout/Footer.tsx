import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              About AugmentX
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              AugmentX is a human augmentation technology platform dedicated to
              advancing safe, ethical, and accessible augmentation solutions. We
              connect individuals, professionals, and providers in a unified
              ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Technologies', to: '/technologies' },
                { label: 'Assessment', to: '/assessment' },
                { label: 'Research', to: '/research' },
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>hello@augmentx.io</li>
              <li>support@augmentx.io</li>
              <li>
                San Francisco, CA
                <br />
                United States
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500">
            &copy; 2026 AugmentX. This is a demo platform for illustrative
            purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
