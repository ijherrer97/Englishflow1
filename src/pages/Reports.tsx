import { Activity, Brain, CalendarCheck, Mic2, Sparkles } from 'lucide-react';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { Card } from '../components/ui/Card';
import type { DashboardMetrics } from '../types';

interface ReportsProps {
  metrics: DashboardMetrics;
  vocabularyCount: number;
  recommendations: string[];
}

export function Reports({ metrics, vocabularyCount, recommendations }: ReportsProps) {
  const reports = [
    ['Total study hours this month', `${metrics.monthHours}h`, Activity],
    ['Average daily consistency', `${metrics.averageDailyConsistency}%`, CalendarCheck],
    ['Best study day', metrics.bestStudyDay, Sparkles],
    ['Weakest skill', metrics.weakestSkill.label, Brain],
    ['Strongest skill', metrics.strongestSkill.label, Brain],
    ['Total vocabulary learned', `${vocabularyCount}`, Sparkles],
    ['Average focus score', `${metrics.averageFocusScore}%`, Activity],
    ['Average pronunciation score', `${metrics.averagePronunciationScore}%`, Mic2],
    ['Average grammar accuracy', `${metrics.averageGrammarAccuracy}%`, Brain],
    ['Study streak', `${metrics.currentStreak} days`, CalendarCheck],
    ['Weekly completion', `${metrics.weeklyCompletion}%`, Sparkles],
  ] as const;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Reports</h1>
        <p className="text-slate-600 dark:text-slate-300">Automatic insights from your English routine.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map(([label, value, Icon]) => (
          <Card key={label}>
            <Icon className="text-indigo-600" />
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
          </Card>
        ))}
      </div>
      <RecommendationCard recommendations={recommendations} />
    </div>
  );
}
