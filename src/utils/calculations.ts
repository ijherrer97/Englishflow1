import type { CEFRLevel, DashboardMetrics, Settings, SkillKey, SkillSummary, StudySession } from '../types';
import { formatDisplayDate, getLastNDays, getWeekRange, isSameMonth, toDateKey } from './dateHelpers';

export const skillLabels: Record<SkillKey, string> = {
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
};

const skillField: Record<SkillKey, keyof StudySession> = {
  listening: 'listeningMinutes',
  speaking: 'speakingMinutes',
  reading: 'readingMinutes',
  writing: 'writingMinutes',
  grammar: 'grammarMinutes',
  vocabulary: 'vocabularyMinutes',
};

const cefrIndex: Record<CEFRLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function sessionMinutesByDate(sessions: StudySession[], dateKey: string): number {
  return sessions.filter((session) => session.date === dateKey).reduce((sum, session) => sum + session.totalMinutes, 0);
}

export function getCurrentStreak(sessions: StudySession[]): number {
  const activeDates = new Set(sessions.filter((session) => session.totalMinutes > 0).map((session) => session.date));
  const cursor = new Date();
  let streak = 0;
  while (activeDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getBestStreak(sessions: StudySession[]): number {
  const dates = [...new Set(sessions.filter((session) => session.totalMinutes > 0).map((session) => session.date))].sort();
  let best = 0;
  let current = 0;
  let previous = '';
  dates.forEach((date) => {
    const expected = previous ? new Date(`${previous}T12:00:00`) : null;
    if (expected) expected.setDate(expected.getDate() + 1);
    current = expected && toDateKey(expected) === date ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  });
  return best;
}

export function getWeeklyTrend(sessions: StudySession[]) {
  return getLastNDays(7).map((date) => ({
    date,
    label: formatDisplayDate(date).split(',')[0],
    minutes: sessionMinutesByDate(sessions, date),
  }));
}

export function getSkillSummaries(sessions: StudySession[]): SkillSummary[] {
  const totals = (Object.keys(skillLabels) as SkillKey[]).map((key) => ({
    key,
    label: skillLabels[key],
    minutes: sessions.reduce((sum, session) => sum + Number(session[skillField[key]]), 0),
  }));
  const maxMinutes = Math.max(1, ...totals.map((skill) => skill.minutes));
  return totals.map((skill) => ({
    ...skill,
    percentage: Math.round((skill.minutes / maxMinutes) * 100),
  }));
}

export function getWeeklyCompletion(sessions: StudySession[], dailyGoal: number): number {
  const week = getWeekRange();
  const completed = week.filter((date) => sessionMinutesByDate(sessions, date) >= dailyGoal).length;
  return Math.round((completed / week.length) * 100);
}

export function getWeeklyCompletedGoals(sessions: StudySession[], dailyGoal: number): number {
  return getWeekRange().filter((date) => sessionMinutesByDate(sessions, date) >= dailyGoal).length;
}

export function getBestStudyDay(sessions: StudySession[]): string {
  if (!sessions.length) return 'No sessions yet';
  const byDate = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.date] = (acc[session.date] ?? 0) + session.totalMinutes;
    return acc;
  }, {});
  const [date] = Object.entries(byDate).sort((a, b) => b[1] - a[1])[0] ?? [];
  return date ? formatDisplayDate(date) : 'No sessions yet';
}

export function getCefrProgress(settings: Settings, sessions: StudySession[]): number {
  const current = cefrIndex[settings.currentCEFR];
  const target = cefrIndex[settings.targetCEFR];
  if (target <= current) return 100;
  const totalHours = sessions.reduce((sum, session) => sum + session.totalMinutes, 0) / 60;
  const base = current / Math.max(1, target);
  const practiceBoost = Math.min(0.4, totalHours / 280);
  return Math.min(99, Math.round((base + practiceBoost) * 100));
}

export function getDashboardMetrics(sessions: StudySession[], settings: Settings): DashboardMetrics {
  const today = toDateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toDateKey(yesterdayDate);
  const monthSessions = sessions.filter((session) => isSameMonth(session.date));
  const skills = getSkillSummaries(sessions);
  const sortedSkills = [...skills].sort((a, b) => b.minutes - a.minutes);
  const activeDaysThisMonth = new Set(monthSessions.map((session) => session.date)).size;
  const daysElapsed = new Date().getDate();

  return {
    todayMinutes: sessionMinutesByDate(sessions, today),
    yesterdayMinutes: sessionMinutesByDate(sessions, yesterday),
    todayWords: sessions.filter((session) => session.date === today).reduce((sum, session) => sum + session.newWords, 0),
    currentStreak: getCurrentStreak(sessions),
    bestStreak: getBestStreak(sessions),
    weeklyCompletion: getWeeklyCompletion(sessions, settings.dailyMinuteGoal),
    weeklyCompletedGoals: getWeeklyCompletedGoals(sessions, settings.dailyMinuteGoal),
    monthHours: Number((monthSessions.reduce((sum, session) => sum + session.totalMinutes, 0) / 60).toFixed(1)),
    averageDailyConsistency: Math.round((activeDaysThisMonth / daysElapsed) * 100),
    speakingMinutes: sessions.reduce((sum, session) => sum + session.speakingMinutes, 0),
    grammarAccuracy: average(monthSessions.map((session) => session.grammarAccuracy)),
    averageFocusScore: average(sessions.map((session) => session.focusScore)),
    averagePronunciationScore: average(sessions.map((session) => session.pronunciationScore)),
    averageGrammarAccuracy: average(sessions.map((session) => session.grammarAccuracy)),
    bestStudyDay: getBestStudyDay(sessions),
    strongestSkill: sortedSkills[0],
    weakestSkill: sortedSkills[sortedSkills.length - 1],
    skills,
  };
}

export function getGoalCompletion(current: number, target: number): number {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
