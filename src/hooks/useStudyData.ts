import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SetStateAction } from 'react';
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
const AUTO_PUSH_DELAY_MS = 1200;
const AUTO_PULL_INTERVAL_MS = 5000;

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
  const localVersionRef = useRef(0);
  const lastUploadedVersionRef = useRef(0);
  const lastRemoteUpdatedAtRef = useRef('');
  const autoSyncStartedRef = useRef(false);
  const syncBusyRef = useRef(false);
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
  const autoSyncEnabled = data.settings.supabaseAutoSyncEnabled !== false;

  const writeData = useCallback((update: SetStateAction<AppData>, markLocalChange = true) => {
    if (markLocalChange) {
      localVersionRef.current += 1;
    }
    setData(update);
  }, [setData]);

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

  useEffect(() => {
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSyncState((current) => ({
        ...current,
        configured: true,
        authenticated: Boolean(session?.user),
        userEmail: session?.user.email,
        error: '',
      }));
      autoSyncStartedRef.current = false;
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const uploadCurrentData = useCallback(
    async (silent = false) => {
      if (!supabase || syncBusyRef.current) return false;
      syncBusyRef.current = true;
      if (!silent) setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));

      try {
        const user = await getCurrentUser(supabase);
        if (!user) throw new Error('Sign in before syncing.');
        const uploadedVersion = localVersionRef.current;
        const updatedAt = await pushEnglishFlowData(supabase, user, data);
        lastUploadedVersionRef.current = uploadedVersion;
        lastRemoteUpdatedAtRef.current = updatedAt;
        setSyncState((current) => ({
          ...current,
          loading: false,
          authenticated: true,
          userEmail: user.email,
          lastSyncedAt: updatedAt,
          message: silent ? 'Auto-synced to Supabase.' : 'Local data uploaded to Supabase.',
          error: '',
        }));
        return true;
      } catch (error) {
        setSyncState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not sync to Supabase.',
        }));
        return false;
      } finally {
        syncBusyRef.current = false;
      }
    },
    [data, supabase],
  );

  const loadLatestCloudData = useCallback(
    async (silent = false) => {
      if (!supabase || syncBusyRef.current) return false;
      syncBusyRef.current = true;
      if (!silent) setSyncState((current) => ({ ...current, loading: true, error: '', message: '' }));

      try {
        const user = await getCurrentUser(supabase);
        if (!user) throw new Error('Sign in before loading cloud data.');
        const cloudData = await pullEnglishFlowData(supabase, user);

        if (!cloudData) {
          syncBusyRef.current = false;
          await uploadCurrentData(true);
          return true;
        }

        if (!lastRemoteUpdatedAtRef.current || cloudData.updatedAt > lastRemoteUpdatedAtRef.current) {
          writeData((current) => mergeCloudData(cloudData.payload, current.settings), false);
          lastRemoteUpdatedAtRef.current = cloudData.updatedAt;
          lastUploadedVersionRef.current = localVersionRef.current;
        }

        setSyncState((current) => ({
          ...current,
          loading: false,
          authenticated: true,
          userEmail: user.email,
          lastSyncedAt: cloudData.updatedAt,
          message: silent ? 'Auto-sync checked for cloud changes.' : 'Cloud data loaded into this device.',
          error: '',
        }));
        return true;
      } catch (error) {
        setSyncState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load cloud data.',
        }));
        return false;
      } finally {
        syncBusyRef.current = false;
      }
    },
    [supabase, uploadCurrentData, writeData],
  );

  const runAutoSync = useCallback(async () => {
    if (!syncState.authenticated || !supabase || !autoSyncEnabled) return;
    if (localVersionRef.current !== lastUploadedVersionRef.current) {
      await uploadCurrentData(true);
      return;
    }
    await loadLatestCloudData(true);
  }, [autoSyncEnabled, loadLatestCloudData, supabase, syncState.authenticated, uploadCurrentData]);

  useEffect(() => {
    if (!syncState.authenticated || !supabase || !autoSyncEnabled) return;
    if (autoSyncStartedRef.current) return;
    autoSyncStartedRef.current = true;
    loadLatestCloudData(true);
  }, [autoSyncEnabled, loadLatestCloudData, supabase, syncState.authenticated]);

  useEffect(() => {
    if (!syncState.authenticated || !supabase || !autoSyncEnabled) return;
    if (localVersionRef.current === lastUploadedVersionRef.current) return;

    const timeout = window.setTimeout(() => {
      uploadCurrentData(true);
    }, AUTO_PUSH_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [autoSyncEnabled, data, supabase, syncState.authenticated, uploadCurrentData]);

  useEffect(() => {
    if (!syncState.authenticated || !supabase || !autoSyncEnabled) return;

    const interval = window.setInterval(() => {
      runAutoSync();
    }, AUTO_PULL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [autoSyncEnabled, runAutoSync, supabase, syncState.authenticated]);

  useEffect(() => {
    if (!syncState.authenticated || !supabase || !autoSyncEnabled) return;

    const syncWhenVisible = () => {
      if (!document.hidden) runAutoSync();
    };

    window.addEventListener('focus', runAutoSync);
    document.addEventListener('visibilitychange', syncWhenVisible);

    return () => {
      window.removeEventListener('focus', runAutoSync);
      document.removeEventListener('visibilitychange', syncWhenVisible);
    };
  }, [autoSyncEnabled, runAutoSync, supabase, syncState.authenticated]);

  function saveSession(session: StudySession) {
    writeData((current) => {
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
    writeData((current) => ({ ...current, sessions: current.sessions.filter((session) => session.id !== id) }));
  }

  function saveVocabulary(word: VocabularyWord) {
    writeData((current) => {
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
    writeData((current) => ({ ...current, vocabulary: current.vocabulary.filter((word) => word.id !== id) }));
  }

  function saveGoal(goal: Goal) {
    writeData((current) => {
      const exists = current.goals.some((item) => item.id === goal.id);
      return {
        ...current,
        goals: exists ? current.goals.map((item) => (item.id === goal.id ? goal : item)) : [...current.goals, goal],
      };
    });
  }

  function deleteGoal(id: string) {
    writeData((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== id) }));
  }

  function updateSettings(settings: Settings) {
    writeData((current) => ({ ...current, settings }));
  }

  function updateSupabaseConnection(supabaseUrl: string, supabaseAnonKey: string) {
    const cleanedUrl = normalizeSupabaseUrl(supabaseUrl);
    const cleanedKey = supabaseAnonKey.trim();
    writeData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        supabaseUrl: cleanedUrl,
        supabaseAnonKey: cleanedKey,
        supabaseSyncEnabled: Boolean(cleanedUrl && cleanedKey),
        supabaseAutoSyncEnabled: true,
      },
    }), false);
    setSyncState({
      configured: Boolean(cleanedUrl && cleanedKey),
      authenticated: false,
      loading: false,
      message: 'Supabase connection saved. First time here? Use Create Account. Already created it? Use Sign In.',
      error: '',
    });
    autoSyncStartedRef.current = false;
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
      lastSyncedAt: syncState.lastSyncedAt,
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
      message: 'Signed in. Automatic sync is on.',
    }));
    autoSyncStartedRef.current = false;
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
    autoSyncStartedRef.current = false;
  }

  async function syncToCloud() {
    await uploadCurrentData(false);
  }

  async function loadFromCloud() {
    await loadLatestCloudData(false);
  }

  function importData(payload: ImportPayload) {
    writeData(normalizeData(payload));
  }

  function resetData() {
    writeData(createDemoData());
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
