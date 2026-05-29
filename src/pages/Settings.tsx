import { Download, Moon, RefreshCcw, Save, Sun, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { AppData, CEFRLevel, ImportPayload, Settings as SettingsType } from '../types';

interface SettingsProps {
  data: AppData;
  onUpdateSettings: (settings: SettingsType) => void;
  onImport: (payload: ImportPayload) => void;
  onReset: () => void;
}

const cefrOptions = ['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => ({ value: level, label: level }));

export function Settings({ data, onUpdateSettings, onImport, onReset }: SettingsProps) {
  const [settings, setSettings] = useState(data.settings);
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
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Data Management</h2>
        <p className="mt-1 text-sm text-slate-500">Everything stays local in your browser using LocalStorage.</p>
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
