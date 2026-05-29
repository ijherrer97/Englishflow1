import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { AppData, Settings } from '../types';

export const SUPABASE_TABLE = 'englishflow_data';

export interface CloudEnglishFlowData {
  payload: AppData;
  updatedAt: string;
}

export function normalizeSupabaseUrl(url: string): string {
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/g, '');
}

export function hasSupabaseConfig(settings: Settings): boolean {
  return Boolean(normalizeSupabaseUrl(settings.supabaseUrl ?? '') && settings.supabaseAnonKey?.trim());
}

export function createSupabaseClient(settings: Settings): SupabaseClient | null {
  if (!hasSupabaseConfig(settings)) return null;
  return createClient(normalizeSupabaseUrl(settings.supabaseUrl!), settings.supabaseAnonKey!.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'englishflow-supabase-auth',
    },
  });
}

export function removePrivateSyncSettings(data: AppData): AppData {
  return {
    ...data,
    settings: {
      ...data.settings,
      supabaseAnonKey: '',
    },
  };
}

export function mergeCloudData(cloudData: AppData, localSettings: Settings): AppData {
  return {
    ...cloudData,
    settings: {
      ...cloudData.settings,
      supabaseUrl: localSettings.supabaseUrl,
      supabaseAnonKey: localSettings.supabaseAnonKey,
      supabaseSyncEnabled: localSettings.supabaseSyncEnabled,
      supabaseAutoSyncEnabled: localSettings.supabaseAutoSyncEnabled,
    },
  };
}

export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function pushEnglishFlowData(client: SupabaseClient, user: User, data: AppData) {
  const payload = removePrivateSyncSettings(data);
  const updatedAt = new Date().toISOString();
  const { data: row, error } = await client
    .from(SUPABASE_TABLE)
    .upsert(
      {
        user_id: user.id,
        payload,
        updated_at: updatedAt,
      },
      { onConflict: 'user_id' },
    )
    .select('updated_at')
    .single();
  if (error) throw error;
  return (row?.updated_at as string | undefined) ?? updatedAt;
}

export async function pullEnglishFlowData(client: SupabaseClient, user: User): Promise<CloudEnglishFlowData | null> {
  const { data, error } = await client
    .from(SUPABASE_TABLE)
    .select('payload, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data?.payload) return null;
  return {
    payload: data.payload as AppData,
    updatedAt: data.updated_at as string,
  };
}
