import type { AppData } from '../types';
import { getDashboardMetrics } from './calculations';

export function getRecommendations(data: AppData): string[] {
  const metrics = getDashboardMetrics(data.sessions, data.settings);
  const suggestions: string[] = [];

  if (metrics.weeklyCompletion >= 70) {
    suggestions.push('Your consistency is improving. Keep your daily minimum above 45 minutes.');
  } else {
    suggestions.push('Protect a short daily block first. A 25 minute session keeps the rhythm alive.');
  }

  if (metrics.weakestSkill) {
    suggestions.push(
      `${metrics.weakestSkill.label} is your weakest skill this week. Add 15 minutes of focused practice tomorrow.`,
    );
  }

  if (metrics.averagePronunciationScore >= 80) {
    suggestions.push('Your pronunciation score is improving. Keep practicing speaking out loud.');
  } else {
    suggestions.push('Try 10 minutes of shadowing after listening practice to lift pronunciation.');
  }

  if (metrics.averageFocusScore < 75) {
    suggestions.push('Focus dips a little. Use one clear task per session and study away from notifications.');
  }

  return suggestions.slice(0, 4);
}
