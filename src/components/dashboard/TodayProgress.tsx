import { BookOpenCheck, Clock, Target } from 'lucide-react';
import { Card } from '../ui/Card';

interface TodayProgressProps {
  minutes: number;
  goal: number;
  completedGoals: number;
}

export function TodayProgress({ minutes, goal, completedGoals }: TodayProgressProps) {
  const progress = Math.min(100, Math.round((minutes / goal) * 100));

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
      <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800">
              <BookOpenCheck size={20} />
            </span>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Today's Progress</h2>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            Keep it up! Consistency is the key to fluency.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 dark:bg-slate-800/70">
              <Clock className="text-blue-600" />
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{minutes}</p>
                <p className="text-xs text-slate-500">Studied today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 dark:bg-slate-800/70">
              <Target className="text-violet-600" />
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{completedGoals}/7</p>
                <p className="text-xs text-slate-500">Weekly goals</p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Daily Goal Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="relative min-h-56 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-glow">
          <div className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs">Hello!</div>
          <div className="absolute bottom-5 left-5 right-5">
            <div className="mb-4 grid h-24 place-items-center rounded-2xl bg-white/15">
              <BookOpenCheck size={58} strokeWidth={1.5} />
            </div>
            <p className="text-lg font-black">English mode is on</p>
            <p className="mt-1 text-sm text-white/75">Small daily wins create confident fluency.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
