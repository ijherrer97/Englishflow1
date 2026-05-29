export type Mood = 'motivated' | 'normal' | 'tired' | 'frustrated' | 'happy';
export type SkillKey = 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface StudySession {
  id: string;
  date: string;
  totalMinutes: number;
  listeningMinutes: number;
  speakingMinutes: number;
  readingMinutes: number;
  writingMinutes: number;
  grammarMinutes: number;
  vocabularyMinutes: number;
  newWords: number;
  focusScore: number;
  pronunciationScore: number;
  grammarAccuracy: number;
  mood: Mood;
  notes: string;
}

export type VocabularyStatus = 'new' | 'learning' | 'mastered';

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  category: string;
  dateAdded: string;
  status: VocabularyStatus;
}

export type GoalType =
  | 'daily-study-minutes'
  | 'weekly-study-hours'
  | 'new-vocabulary-words'
  | 'speaking-practice-minutes'
  | 'grammar-accuracy'
  | 'listening-practice';

export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  status: GoalStatus;
}

export interface Settings {
  userName: string;
  dailyMinuteGoal: number;
  currentCEFR: CEFRLevel;
  targetCEFR: CEFRLevel;
  darkMode: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseSyncEnabled?: boolean;
  supabaseAutoSyncEnabled?: boolean;
}

export interface AppData {
  sessions: StudySession[];
  vocabulary: VocabularyWord[];
  goals: Goal[];
  settings: Settings;
}

export interface SkillSummary {
  key: SkillKey;
  label: string;
  minutes: number;
  percentage: number;
}

export interface DashboardMetrics {
  todayMinutes: number;
  yesterdayMinutes: number;
  todayWords: number;
  currentStreak: number;
  bestStreak: number;
  weeklyCompletion: number;
  weeklyCompletedGoals: number;
  monthHours: number;
  averageDailyConsistency: number;
  speakingMinutes: number;
  grammarAccuracy: number;
  averageFocusScore: number;
  averagePronunciationScore: number;
  averageGrammarAccuracy: number;
  bestStudyDay: string;
  strongestSkill: SkillSummary;
  weakestSkill: SkillSummary;
  skills: SkillSummary[];
}

export interface ImportPayload {
  sessions?: StudySession[];
  vocabulary?: VocabularyWord[];
  goals?: Goal[];
  settings?: Settings;
}

export interface SupabaseSyncState {
  configured: boolean;
  authenticated: boolean;
  userEmail?: string;
  loading: boolean;
  message: string;
  error: string;
  lastSyncedAt?: string;
}
