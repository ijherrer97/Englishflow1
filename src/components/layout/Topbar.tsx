import { Bell, CalendarDays, Moon, Search, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopbarProps {
  userName: string;
  streak: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Topbar({ userName, streak, darkMode, onToggleDarkMode }: TopbarProps) {
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex">
          <Search size={18} />
          <span>Search anything...</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:flex">
            <CalendarDays size={17} />
            {today}
          </div>
          <span className="hidden rounded-xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600 dark:bg-orange-950 sm:block">
            {streak} day streak
          </span>
          <Button variant="ghost" onClick={onToggleDarkMode} icon={darkMode ? <Sun size={18} /> : <Moon size={18} />} aria-label="Toggle dark mode" />
          <Button variant="ghost" icon={<Bell size={18} />} aria-label="Notifications" />
          <div className="flex items-center gap-2 rounded-full bg-white p-1 pr-3 shadow-sm dark:bg-slate-900">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <span className="hidden text-sm font-bold text-slate-700 dark:text-slate-200 sm:block">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
