import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppData, Goal, ImportPayload, Settings, StudySession, SupabaseSyncState, VocabularyWord } from '../types';
import { getDashboardMetrics } from '../utils/calculations';
import { createDemoData } from '../utils/demoData';
import { getRecommendations } from '../utils/recommendations';
import {
  createSupabaseClient,
  getCurrentUser,
  hasSupabaseConfig,
  mergeCloudData,
  normalizeSupabaseUrl,
  pullEnglishFlowData,
  pushEnglishFlowData,
} from '../utils/supabaseSync';
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
  const [syncState, setSyncState] = useState<SupabaseSyncState>({
    configured: hasSupabaseConfig(data.settings),
    authenticated: false,
    loading: false,
    message: '',
    error: '',
  });

  const metrics = useMemo(() => getDashboardMetrics(data.sessions, data.settings), [data.sessions, data.settings]);
  const recommendations = useMemo(() => getRecommendations(data), [data]);
  const supabase = useMemo(() => createSupabaseClient(data.settings), [data.settings]);

  const refreshSupabaseUser = useCallback(async () => {
    const configured = hasSupabaseConfig(data.settings);
    if (!configured || !supabase) {
      setSyncState((current) => ({ ...current, configured, authenticated: false, userEmail: undefined }));
      return null;
    }

    const user = await getCurrentUser(supabase);
    setSyncState((current) => ({
      ...current,
      configured,
      authenticated: Boolean(user),
      userEmail: user?.email,
    }));
    return user;
  }, [data.settings, supabase]);

  useEffect(() => {
    refreshSupabaseUser();
  }, [refreshSupabaseUser]);

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

  function updateSupabaseConnection(supabaseUrl: string, supabaseAnonKey: string) {
    const cleanedUrl = normalizeSupabaseUrl(supabaseUrl);
    const cleanedKey = supabaseAnonKey.trim();
    setData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        supabaseUrl: cleanedUrl,
        supabaseAnonKey: cleanedKey,
        supabaseSyncEnabled: Boolean(cleanedUrl && cleanedKey),
      },
    }));
    setSyncState({
      configured: Boolean(cleanedUrl && cleanedKey),
      authenticated: false,
      loading: false,
      message: 'Supabase connection saved. First time here? Use Create Account. Already created it? Use Sign In.',
      error: '',
    });
  }

  async function signUpWithSupabase(email: string, password: string) {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setSyncState((current) => ({ ...current, loading: false, error: error.message }));
      return;
    }

    const user = authData.user ?? (await getCurrentUser(supabase));
    setSyncState((current) => ({
      ...current,
      loading: false,
      authenticated: Boolean(user),
      userEmail: user?.email ?? email,
      message: authData.session
        ? 'Account created. You can sync now.'
        : 'Account created. Check your email and confirm it, then come back and use Sign In.',
    }));
  }

  async function signInWithSupabase(email: string, password: string) {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setSyncState((current) => ({ ...current, loading: false, authenticated: false, error: error.message }));
      return;
    }

    setSyncState((current) => ({
      ...current,
      loading: false,
      authenticated: true,
      userEmail: authData.user.email,
      message: 'Signed in. You can sync your EnglishFlow data.',
    }));
  }

  async function requestSupabasePasswordReset(email: string) {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setSyncState((current) => ({ ...current, loading: false, error: error.message }));
      return;
    }

    setSyncState((current) => ({
      ...current,
      loading: false,
      message: 'Password reset email sent. Open it, then return here and set a new password.',
    }));
  }

  async function sendSupabaseMagicLink(email: string) {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setSyncState((current) => ({ ...current, loading: false, error: error.message }));
      return;
    }

    setSyncState((current) => ({
      ...current,
      loading: false,
      message: 'Login link sent. Open the email link on this device, then return to EnglishFlow.',
    }));
  }

  async function updateSupabasePassword(newPassword: string) {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setSyncState((current) => ({ ...current, loading: false, error: error.message }));
      return;
    }

    const user = await refreshSupabaseUser();
    setSyncState((current) => ({
      ...current,
      loading: false,
      authenticated: Boolean(user),
      userEmail: user?.email,
      message: 'Password updated. You can sign in with the new password.',
    }));
  }

  async function signOutFromSupabase() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSyncState((current) => ({
      ...current,
      authenticated: false,
      userEmail: undefined,
      message: 'Signed out from Supabase.',
      error: '',
    }));
  }

  async function syncToCloud() {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    try {
      const user = await refreshSupabaseUser();
      if (!user) throw new Error('Sign in before syncing.');
      await pushEnglishFlowData(supabase, user, data);
      setSyncState((current) => ({
        ...current,
        loading: false,
        authenticated: true,
        userEmail: user.email,
        message: 'Local data uploaded to Supabase.',
      }));
    } catch (error) {
      setSyncState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : 'Could not sync to Supabase.',
      }));
    }
  }

  async function loadFromCloud() {
    if (!supabase) {
      setSyncState((current) => ({ ...current, error: 'Add your Supabase URL and anon key first.' }));
      return;
    }

    setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));
    try {
      const user = await refreshSupabaseUser();
      if (!user) throw new Error('Sign in before loading cloud data.');
      const cloudData = await pullEnglishFlowData(supabase, user);
      if (!cloudData) {
        setSyncState((current) => ({
          ...current,
          loading: false,
          authenticated: true,
          userEmail: user.email,
          message: 'No cloud data yet. Use Upload to Cloud first.',
        }));
        return;
      }
      setData((current) => mergeCloudData(cloudData, current.settings));
      setSyncState((current) => ({
        ...current,
        loading: false,
        authenticated: true,
        userEmail: user.email,
        message: 'Cloud data loaded into this device.',
      }));
    } catch (error) {
      setSyncState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : 'Could not load cloud data.',
      }));
    }
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
    updateSupabaseConnection,
    syncState,
    signUpWithSupabase,
    signInWithSupabase,
    sendSupabaseMagicLink,
    requestSupabasePasswordReset,
    updateSupabasePassword,
    signOutFromSupabase,
    syncToCloud,
    loadFromCloud,
    importData,
    resetData,
  };
}
