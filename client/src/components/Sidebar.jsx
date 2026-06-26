import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, ScrollText } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-zinc-900/50 border-r border-zinc-800/60 backdrop-blur-xl z-40">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-800/60 shrink-0">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <ScrollText className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Resume Screener</h1>
          <p className="text-[10px] text-zinc-500 font-medium">AI-Powered HR Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-zinc-800/60 shrink-0">
        <p className="text-[11px] text-zinc-600">v1.0.0</p>
      </div>
    </aside>
  );
}

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-900/95 border-t border-zinc-800/60 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors
              ${isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
