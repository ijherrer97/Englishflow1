import type { AppData, Goal, Settings, StudySession, VocabularyWord } from '../types';
import { addDays, toDateKey } from './dateHelpers';

const moods = ['motivated', 'normal', 'tired', 'frustrated', 'happy'] as const;
const sampleWords = [
  ['thrive', 'prosper or grow strongly', 'I thrive when I study every morning.', 'Mindset'],
  ['outline', 'a general description or plan', 'Can you outline the main argument?', 'Academic'],
  ['steady', 'firm and consistent', 'A steady routine builds fluency.', 'Productivity'],
  ['polish', 'improve or refine', 'I need to polish my pronunciation.', 'Speaking'],
  ['insight', 'a clear understanding', 'The report gave me a useful insight.', 'Business'],
  ['reliable', 'able to be trusted', 'I want reliable English habits.', 'Daily'],
  ['shadowing', 'speaking practice by repeating audio', 'Shadowing helps my rhythm.', 'Speaking'],
  ['accuracy', 'correctness', 'Grammar accuracy improved this week.', 'Grammar'],
  ['fluency', 'smooth natural speech', 'Fluency comes from repetition.', 'Speaking'],
  ['retain', 'keep in memory', 'I retain words by using examples.', 'Vocabulary'],
];

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function splitMinutes(total: number, seed: number) {
  const listening = Math.round(total * (0.2 + ((seed % 3) * 0.03)));
  const speaking = Math.round(total * (0.16 + ((seed % 4) * 0.02)));
  const reading = Math.round(total * (0.17 + ((seed % 2) * 0.04)));
  const writing = Math.round(total * (0.11 + ((seed % 5) * 0.01)));
  const grammar = Math.round(total * (0.14 + ((seed % 3) * 0.02)));
  const used = listening + speaking + reading + writing + grammar;
  return {
    listeningMinutes: listening,
    speakingMinutes: speaking,
    readingMinutes: reading,
    writingMinutes: writing,
    grammarMinutes: grammar,
    vocabularyMinutes: Math.max(5, total - used),
  };
}

function createSessions(): StudySession[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const dayOffset = index - 29;
    const date = toDateKey(addDays(today, dayOffset));
    const skip = [2, 9, 17, 24].includes(index);
    if (skip) return null;
    const total = 30 + ((index * 13) % 61);
    const scoresBoost = Math.min(20, Math.floor(index / 2));
    return {
      id: id('session'),
      date,
      totalMinutes: total,
      ...splitMinutes(total, index),
      newWords: 2 + ((index * 3) % 8),
      focusScore: Math.min(95, 62 + ((index * 7) % 22) + Math.floor(scoresBoost / 4)),
      pronunciationScore: Math.min(95, 60 + ((index * 5) % 26) + Math.floor(scoresBoost / 5)),
      grammarAccuracy: Math.min(95, 64 + ((index * 4) % 24) + Math.floor(scoresBoost / 6)),
      mood: moods[index % moods.length],
      notes:
        index % 3 === 0
          ? 'Shadowing practice felt smoother today.'
          : index % 3 === 1
            ? 'Reviewed grammar patterns and added new vocabulary.'
            : 'Good listening session with podcast notes.',
    } satisfies StudySession;
  }).filter(Boolean) as StudySession[];
}

function createVocabulary(): VocabularyWord[] {
  return sampleWords.map(([word, meaning, example, category], index) => ({
    id: id('word'),
    word,
    meaning,
    example,
    category,
    dateAdded: toDateKey(addDays(new Date(), -index)),
    status: index % 4 === 0 ? 'mastered' : index % 2 === 0 ? 'learning' : 'new',
  }));
}

function createGoals(): Goal[] {
  return [
    {
      id: id('goal'),
      name: 'Daily study momentum',
      type: 'daily-study-minutes',
      target: 60,
      current: 45,
      unit: 'minutes',
      status: 'active',
    },
    {
      id: id('goal'),
      name: 'Weekly speaking reps',
      type: 'speaking-practice-minutes',
      target: 180,
      current: 124,
      unit: 'minutes',
      status: 'active',
    },
    {
      id: id('goal'),
      name: 'Vocabulary sprint',
      type: 'new-vocabulary-words',
      target: 80,
      current: 43,
      unit: 'words',
      status: 'active',
    },
    {
      id: id('goal'),
      name: 'Grammar accuracy push',
      type: 'grammar-accuracy',
      target: 88,
      current: 82,
      unit: '%',
      status: 'active',
    },
  ];
}

export const defaultSettings: Settings = {
  userName: 'Isaac',
  dailyMinuteGoal: 60,
  currentCEFR: 'A2',
  targetCEFR: 'B2',
  darkMode: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseSyncEnabled: false,
  supabaseAutoSyncEnabled: true,
};

export function createDemoData(): AppData {
  return {
    sessions: createSessions(),
    vocabulary: createVocabulary(),
    goals: createGoals(),
    settings: defaultSettings,
  };
}
