import { Lightbulb } from 'lucide-react';
import { Card } from '../ui/Card';

export function RecommendationCard({ recommendations }: { recommendations: string[] }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950">
          <Lightbulb size={21} />
        </span>
        <div>
          <h2 className="font-bold text-slate-950 dark:text-white">Smart Recommendations</h2>
          <p className="text-xs text-slate-500">Generated from your real activity</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {recommendations.map((recommendation) => (
          <div key={recommendation} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {recommendation}
          </div>
        ))}
      </div>
    </Card>
  );
}
