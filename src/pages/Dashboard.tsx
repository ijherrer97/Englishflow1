import { BookOpen, Clock, Flame, Target } from 'lucide-react';
import type { AppData, DashboardMetrics } from '../types';
import { CEFRJourney } from '../components/dashboard/CEFRJourney';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { SkillChart } from '../components/dashboard/SkillChart';
import { StatCard } from '../components/dashboard/StatCard';
import { TodayProgress } from '../components/dashboard/TodayProgress';
import { WeeklyTrendChart } from '../components/dashboard/WeeklyTrendChart';
import { Card } from '../components/ui/Card';

interface DashboardProps {
  data: AppData;
  metrics: DashboardMetrics;
  recommendations: string[];
}

export function Dashboard({ data, metrics, recommendations }: DashboardProps) {
  const yesterdayDelta = metrics.yesterdayMinutes
    ? Math.round(((metrics.todayMinutes - metrics.yesterdayMinutes) / metrics.yesterdayMinutes) * 100)
    : 100;

  return (
    <div className="grid gap-5">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Welcome {data.settings.userName}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">Track your English routine and improve every day.</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_1.35fr]">
        <TodayProgress minutes={metrics.todayMinutes} goal={data.settings.dailyMinuteGoal} completedGoals={metrics.weeklyCompletedGoals} />
        <div className="grid gap-5 sm:grid-cols-2">
          <StatCard title="Study Streak" value={`${metrics.currentStreak} days`} subtitle={`Best: ${metrics.bestStreak} days`} icon={<Flame size={22} />} gradient="bg-gradient-to-br from-blue-600 to-sky-500" />
          <StatCard title="Minutes Studied Today" value={`${metrics.todayMinutes} min`} subtitle={`${yesterdayDelta >= 0 ? '+' : ''}${yesterdayDelta}% vs yesterday`} icon={<Clock size={22} />} gradient="bg-gradient-to-br from-violet-600 to-indigo-500" />
          <StatCard title="New Words Learned" value={`${metrics.todayWords} words`} subtitle="Vocabulary momentum" icon={<BookOpen size={22} />} gradient="bg-gradient-to-br from-indigo-500 to-violet-500" />
          <StatCard title="Weekly Goal Completion" value={`${metrics.weeklyCompletion}%`} subtitle={`${metrics.weeklyCompletedGoals} of 7 goals completed`} icon={<Target size={22} />} gradient="bg-gradient-to-br from-coral to-rose-500" />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.08fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Routine Performance</h2>
            <span className="text-xs font-semibold text-slate-500">This Month</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ['Total Study Hours', metrics.monthHours, 'hours'],
              ['Avg. Daily Consistency', metrics.averageDailyConsistency, '%'],
              ['Speaking Minutes', metrics.speakingMinutes, 'min'],
              ['Grammar Accuracy', metrics.grammarAccuracy, '%'],
            ].map(([label, value, unit]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-2xl font-black text-slate-950 dark:text-white">{value}{unit === '%' ? '%' : ''}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </Card>
        <SkillChart skills={metrics.skills} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <WeeklyTrendChart sessions={data.sessions} />
        <CEFRJourney settings={data.settings} sessions={data.sessions} />
        <RecommendationCard recommendations={recommendations} />
      </section>
    </div>
  );
}
