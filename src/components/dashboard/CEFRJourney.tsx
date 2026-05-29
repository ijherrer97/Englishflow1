import type { Settings, StudySession } from '../../types';
import { getCefrProgress } from '../../utils/calculations';
import { Card } from '../ui/Card';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

export function CEFRJourney({ settings, sessions }: { settings: Settings; sessions: StudySession[] }) {
  const progress = getCefrProgress(settings, sessions);

  return (
    <Card>
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">CEFR Journey</h2>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Current Level</p>
          <p className="text-3xl font-black text-blue-600">{settings.currentCEFR}+</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Target Level</p>
          <p className="text-3xl font-black text-violet-600">{settings.targetCEFR}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-5 text-center text-xs font-semibold text-slate-500">
          {levels.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      </div>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        You are <span className="font-black text-blue-600">{progress}%</span> of the way to {settings.targetCEFR}. Keep going.
      </p>
    </Card>
  );
}
