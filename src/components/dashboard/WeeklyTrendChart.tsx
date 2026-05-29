import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { StudySession } from '../../types';
import { getWeeklyTrend } from '../../utils/calculations';
import { Card } from '../ui/Card';

export function WeeklyTrendChart({ sessions }: { sessions: StudySession[] }) {
  const data = getWeeklyTrend(sessions);
  const average = Math.round(data.reduce((sum, item) => sum + item.minutes, 0) / data.length);
  const best = data.reduce((top, item) => (item.minutes > top.minutes ? item : top), data[0]);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Weekly Study Trend</h2>
          <p className="text-xs text-slate-500">Avg {average} min/day · Best {best?.label}</p>
        </div>
        <span className="text-xs font-semibold text-slate-500">Last 7 Days</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
