import { CalendarDays } from 'lucide-react';
import { Card } from '../components/ui/Card';
import type { StudySession } from '../types';
import { getLastNDays, formatDisplayDate } from '../utils/dateHelpers';

interface CalendarProps {
  sessions: StudySession[];
  dailyGoal: number;
}

export function Calendar({ sessions, dailyGoal }: CalendarProps) {
  const days = getLastNDays(35);

  function minutesFor(date: string) {
    return sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.totalMinutes, 0);
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Calendar</h1>
        <p className="text-slate-600 dark:text-slate-300">Visualize studied days, missed days and daily goal intensity.</p>
      </div>
      <Card>
        <div className="mb-5 flex items-center gap-3">
          <CalendarDays className="text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Last 35 Days</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date) => {
            const minutes = minutesFor(date);
            const completed = minutes >= dailyGoal;
            const intensity = Math.min(1, minutes / Math.max(1, dailyGoal));
            return (
              <div
                key={date}
                className="aspect-square rounded-xl border border-slate-100 p-2 text-xs dark:border-slate-800"
                style={{
                  background: minutes
                    ? `rgba(79, 70, 229, ${0.12 + intensity * 0.55})`
                    : 'rgba(148, 163, 184, 0.08)',
                }}
                title={`${date}: ${minutes} min`}
              >
                <p className="font-bold text-slate-900 dark:text-white">{new Date(`${date}T12:00:00`).getDate()}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{minutes}m</p>
                <p className={`mt-1 font-semibold ${completed ? 'text-emerald-600' : 'text-slate-500'}`}>{completed ? 'done' : minutes ? 'light' : 'off'}</p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Weekly List</h2>
        <div className="grid gap-3">
          {days.slice(-7).map((date) => {
            const minutes = minutesFor(date);
            return (
              <div key={date} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{formatDisplayDate(date)}</p>
                  <p className="text-sm text-slate-500">{minutes ? 'Studied' : 'No study session'}</p>
                </div>
                <span className="text-lg font-black text-indigo-600">{minutes} min</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
