import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/alerts', label: 'Alertes', icon: '🚨' },
  { to: '/report', label: 'Signaler', icon: '📍' },
  { to: '/profile', label: 'Profil', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
              isActive ? 'text-brand' : 'text-text-tertiary'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
