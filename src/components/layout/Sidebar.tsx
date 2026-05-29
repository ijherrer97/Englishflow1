import { BookOpen, Sparkles, Trophy } from 'lucide-react';
import { navItems, type PageId } from './navItems';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200/80 bg-white/90 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:block">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-glow">
          <BookOpen size={22} />
        </span>
        <span className="text-2xl font-black tracking-tight text-blue-700 dark:text-blue-300">EnglishFlow</span>
      </div>

      <nav className="mt-8 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-blue-700 to-violet-700 text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 p-5 dark:from-slate-900 dark:to-indigo-950">
        <div className="flex items-center gap-3">
          <Trophy className="text-amber-500" />
          <p className="font-bold text-slate-900 dark:text-white">Premium Routine</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Unlock stronger consistency with daily insights.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-blue-700 dark:bg-slate-800 dark:text-blue-300">
          <Sparkles size={16} /> Stay consistent
        </div>
      </div>
    </aside>
  );
}
