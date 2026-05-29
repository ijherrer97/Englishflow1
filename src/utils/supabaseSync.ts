import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { AppData, Settings } from '../types';

export const SUPABASE_TABLE = 'englishflow_data';

export function hasSupabaseConfig(settings: Settings): boolean {
  return Boolean(settings.supabaseUrl?.trim() && settings.supabaseAnonKey?.trim());
}

export function createSupabaseClient(settings: Settings): SupabaseClient | null {
  if (!hasSupabaseConfig(settings)) return null;
  return createClient(settings.supabaseUrl!.trim(), settings.supabaseAnonKey!.trim(), {
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
  const { error } = await client.from(SUPABASE_TABLE).upsert(
    {
      user_id: user.id,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) throw error;
}

export async function pullEnglishFlowData(client: SupabaseClient, user: User): Promise<AppData | null> {
  const { data, error } = await client
    .from(SUPABASE_TABLE)
    .select('payload')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return (data?.payload as AppData | undefined) ?? null;
}
