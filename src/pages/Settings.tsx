import {
  CloudDownload,
  CloudUpload,
  Database,
  Download,
  KeyRound,
  LogIn,
  LogOut,
  Moon,
  RefreshCcw,
  Save,
  Sun,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { AppData, CEFRLevel, ImportPayload, Settings as SettingsType, SupabaseSyncState } from '../types';

interface SettingsProps {
  data: AppData;
  syncState: SupabaseSyncState;
  onUpdateSettings: (settings: SettingsType) => void;
  onUpdateSupabaseConnection: (supabaseUrl: string, supabaseAnonKey: string) => void;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onRequestPasswordReset: (email: string) => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onSyncToCloud: () => Promise<void>;
  onLoadFromCloud: () => Promise<void>;
  onImport: (payload: ImportPayload) => void;
  onReset: () => void;
}

const cefrOptions = ['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => ({ value: level, label: level }));

export function Settings({
  data,
  syncState,
  onUpdateSettings,
  onUpdateSupabaseConnection,
  onSignUp,
  onSignIn,
  onRequestPasswordReset,
  onUpdatePassword,
  onSignOut,
  onSyncToCloud,
  onLoadFromCloud,
  onImport,
  onReset,
}: SettingsProps) {
  const [settings, setSettings] = useState(data.settings);
  const [supabaseUrl, setSupabaseUrl] = useState(data.settings.supabaseUrl ?? '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(data.settings.supabaseAnonKey ?? '');
  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [newSyncPassword, setNewSyncPassword] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'englishflow-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file?: File) {
    if (!file) return;
    const text = await file.text();
    onImport(JSON.parse(text) as ImportPayload);
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">Personalize goals, levels, dark mode and local data.</p>
      </div>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="User name" value={settings.userName} onChange={(event) => setSettings({ ...settings, userName: event.target.value })} />
          <Input label="Daily minute goal" type="number" min={1} value={settings.dailyMinuteGoal} onChange={(event) => setSettings({ ...settings, dailyMinuteGoal: Number(event.target.value) })} />
          <Select label="Current CEFR" value={settings.currentCEFR} options={cefrOptions} onChange={(event) => setSettings({ ...settings, currentCEFR: event.target.value as CEFRLevel })} />
          <Select label="Target CEFR" value={settings.targetCEFR} options={cefrOptions} onChange={(event) => setSettings({ ...settings, targetCEFR: event.target.value as CEFRLevel })} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => onUpdateSettings(settings)} icon={<Save size={18} />}>Save Settings</Button>
          <Button
            variant="secondary"
            onClick={() => {
              const next = { ...settings, darkMode: !settings.darkMode };
              setSettings(next);
              onUpdateSettings(next);
            }}
            icon={settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          >
            {settings.darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-200">
            <Database size={22} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Supabase Cloud Sync</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sync your EnglishFlow data between your phone and computer with your Supabase project.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input
            label="Supabase Project URL"
            placeholder="https://xxxx.supabase.co"
            value={supabaseUrl}
            onChange={(event) => setSupabaseUrl(event.target.value)}
          />
          <Input
            label="Supabase anon public key"
            type="password"
            placeholder="eyJhbGciOi..."
            value={supabaseAnonKey}
            onChange={(event) => setSupabaseAnonKey(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => onUpdateSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim())}
            icon={<Save size={18} />}
          >
            Save Connection
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={syncEmail}
            onChange={(event) => setSyncEmail(event.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={syncPassword}
            onChange={(event) => setSyncPassword(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            disabled={syncState.loading}
            onClick={() => onSignUp(syncEmail.trim(), syncPassword)}
            icon={<UserPlus size={18} />}
          >
            Create Account
          </Button>
          <Button
            disabled={syncState.loading}
            onClick={() => onSignIn(syncEmail.trim(), syncPassword)}
            icon={<LogIn size={18} />}
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            disabled={!syncState.authenticated || syncState.loading}
            onClick={onSignOut}
            icon={<LogOut size={18} />}
          >
            Sign Out
          </Button>
          <Button
            variant="ghost"
            disabled={syncState.loading || !syncEmail}
            onClick={() => onRequestPasswordReset(syncEmail.trim())}
            icon={<KeyRound size={18} />}
          >
            Reset Password
          </Button>
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800 md:grid-cols-[1fr_auto] md:items-end">
          <Input
            label="New password after reset email"
            type="password"
            placeholder="Type your new password here"
            value={newSyncPassword}
            onChange={(event) => setNewSyncPassword(event.target.value)}
          />
          <Button
            variant="secondary"
            disabled={syncState.loading || newSyncPassword.length < 6}
            onClick={() => onUpdatePassword(newSyncPassword)}
            icon={<KeyRound size={18} />}
          >
            Update Password
          </Button>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
          <p className="font-bold text-slate-900 dark:text-white">
            Status: {syncState.authenticated ? `Connected as ${syncState.userEmail}` : syncState.configured ? 'Connection saved' : 'Not connected'}
          </p>
          {syncState.message && <p className="mt-2 text-emerald-700 dark:text-emerald-300">{syncState.message}</p>}
          {syncState.error && <p className="mt-2 text-rose-700 dark:text-rose-300">{syncState.error}</p>}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            disabled={!syncState.authenticated || syncState.loading}
            onClick={onSyncToCloud}
            icon={<CloudUpload size={18} />}
          >
            Upload to Cloud
          </Button>
          <Button
            variant="secondary"
            disabled={!syncState.authenticated || syncState.loading}
            onClick={() => {
              if (confirm('Load cloud data into this device? This will replace the current local EnglishFlow data.')) {
                onLoadFromCloud();
              }
            }}
            icon={<CloudDownload size={18} />}
          >
            Load from Cloud
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Data Management</h2>
        <p className="mt-1 text-sm text-slate-500">Local backup still works. Export JSON before big changes.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={exportJson} icon={<Download size={18} />}>Export JSON</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} icon={<Upload size={18} />}>Import JSON</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm('Reset all EnglishFlow data and reload demo data?')) onReset();
            }}
            icon={<RefreshCcw size={18} />}
          >
            Reset Data
          </Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => importJson(event.target.files?.[0])} />
        </div>
      </Card>
    </div>
  );
}
