import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SkillSummary } from '../../types';
import { Card } from '../ui/Card';

export function SkillChart({ skills }: { skills: SkillSummary[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Skill Progress</h2>
        <span className="text-xs font-semibold text-slate-500">This Month</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={skills}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="percentage" radius={[10, 10, 0, 0]} fill="url(#skillGradient)" />
            <defs>
              <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="55%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
