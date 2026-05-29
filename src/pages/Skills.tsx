import { BarChart, Radar } from 'recharts';
import { Bar, CartesianGrid, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/ui/Card';
import type { DashboardMetrics } from '../types';

export function Skills({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Skills</h1>
        <p className="text-slate-600 dark:text-slate-300">See accumulated practice, balance and next best move.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.skills.map((skill) => (
          <Card key={skill.key}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-950 dark:text-white">{skill.label}</h2>
              <span className="text-sm font-black text-indigo-600">{skill.percentage}%</span>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-950 dark:text-white">{skill.minutes}</p>
            <p className="text-sm text-slate-500">minutes accumulated</p>
            <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600" style={{ width: `${skill.percentage}%` }} />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Comparative Progress</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.skills}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Skill Balance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={metrics.skills}>
                <PolarGrid />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar dataKey="percentage" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <p className="text-sm font-semibold text-white/75">Automatic recommendation</p>
        <p className="mt-2 text-xl font-black">
          {metrics.weakestSkill.label} is your weakest skill this week. Add 15 minutes of shadowing tomorrow.
        </p>
        <p className="mt-2 text-sm text-white/75">Strongest skill: {metrics.strongestSkill.label}</p>
      </Card>
    </div>
  );
}
