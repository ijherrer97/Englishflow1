import { useMemo } from 'react';
import type { AppData, Goal, ImportPayload, Settings, StudySession, VocabularyWord } from '../types';
import { getDashboardMetrics } from '../utils/calculations';
import { createDemoData } from '../utils/demoData';
import { getRecommendations } from '../utils/recommendations';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'englishflow-data-v1';

function normalizeData(payload: ImportPayload): AppData {
  const demo = createDemoData();
  return {
    sessions: payload.sessions?.length ? payload.sessions : demo.sessions,
    vocabulary: payload.vocabulary?.length ? payload.vocabulary : demo.vocabulary,
    goals: payload.goals?.length ? payload.goals : demo.goals,
    settings: { ...demo.settings, ...(payload.settings ?? {}) },
  };
}

export function useStudyData() {
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, createDemoData());

  const metrics = useMemo(() => getDashboardMetrics(data.sessions, data.settings), [data.sessions, data.settings]);
  const recommendations = useMemo(() => getRecommendations(data), [data]);

  function saveSession(session: StudySession) {
    setData((current) => {
      const exists = current.sessions.some((item) => item.id === session.id);
      return {
        ...current,
        sessions: exists
          ? current.sessions.map((item) => (item.id === session.id ? session : item))
          : [...current.sessions, session],
      };
    });
  }

  function deleteSession(id: string) {
    setData((current) => ({ ...current, sessions: current.sessions.filter((session) => session.id !== id) }));
  }

  function saveVocabulary(word: VocabularyWord) {
    setData((current) => {
      const exists = current.vocabulary.some((item) => item.id === word.id);
      return {
        ...current,
        vocabulary: exists
          ? current.vocabulary.map((item) => (item.id === word.id ? word : item))
          : [...current.vocabulary, word],
      };
    });
  }

  function deleteVocabulary(id: string) {
    setData((current) => ({ ...current, vocabulary: current.vocabulary.filter((word) => word.id !== id) }));
  }

  function saveGoal(goal: Goal) {
    setData((current) => {
      const exists = current.goals.some((item) => item.id === goal.id);
      return {
        ...current,
        goals: exists ? current.goals.map((item) => (item.id === goal.id ? goal : item)) : [...current.goals, goal],
      };
    });
  }

  function deleteGoal(id: string) {
    setData((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== id) }));
  }

  function updateSettings(settings: Settings) {
    setData((current) => ({ ...current, settings }));
  }

  function importData(payload: ImportPayload) {
    setData(normalizeData(payload));
  }

  function resetData() {
    setData(createDemoData());
  }

  return {
    data,
    metrics,
    recommendations,
    saveSession,
    deleteSession,
    saveVocabulary,
    deleteVocabulary,
    saveGoal,
    deleteGoal,
    updateSettings,
    importData,
    resetData,
  };
}
