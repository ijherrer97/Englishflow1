import { useState } from 'react';
import type { Mood, StudySession } from '../../types';
import { toDateKey } from '../../utils/dateHelpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface StudySessionFormProps {
  initial?: StudySession;
  onSubmit: (session: StudySession) => void;
  onCancel?: () => void;
}

const moodOptions = ['motivated', 'normal', 'tired', 'frustrated', 'happy'].map((mood) => ({ value: mood, label: mood }));

const emptySession: StudySession = {
  id: '',
  date: toDateKey(),
  totalMinutes: 60,
  listeningMinutes: 15,
  speakingMinutes: 10,
  readingMinutes: 10,
  writingMinutes: 10,
  grammarMinutes: 10,
  vocabularyMinutes: 5,
  newWords: 5,
  focusScore: 80,
  pronunciationScore: 78,
  grammarAccuracy: 82,
  mood: 'motivated',
  notes: '',
};

export function StudySessionForm({ initial, onSubmit, onCancel }: StudySessionFormProps) {
  const [form, setForm] = useState<StudySession>(initial ?? { ...emptySession, id: crypto.randomUUID() });
  const [error, setError] = useState('');

  function updateNumber(key: keyof StudySession, value: string) {
    setForm((current) => ({ ...current, [key]: Number(value) }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const numericValues = [
      form.totalMinutes,
      form.listeningMinutes,
      form.speakingMinutes,
      form.readingMinutes,
      form.writingMinutes,
      form.grammarMinutes,
      form.vocabularyMinutes,
      form.newWords,
    ];
    const scores = [form.focusScore, form.pronunciationScore, form.grammarAccuracy];
    if (numericValues.some((value) => value < 0)) {
      setError('Numbers cannot be negative.');
      return;
    }
    if (scores.some((value) => value < 0 || value > 100)) {
      setError('Scores must be between 0 and 100.');
      return;
    }
    setError('');
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        <Input label="Total minutes" type="number" min={0} value={form.totalMinutes} onChange={(event) => updateNumber('totalMinutes', event.target.value)} />
        <Input label="Listening minutes" type="number" min={0} value={form.listeningMinutes} onChange={(event) => updateNumber('listeningMinutes', event.target.value)} />
        <Input label="Speaking minutes" type="number" min={0} value={form.speakingMinutes} onChange={(event) => updateNumber('speakingMinutes', event.target.value)} />
        <Input label="Reading minutes" type="number" min={0} value={form.readingMinutes} onChange={(event) => updateNumber('readingMinutes', event.target.value)} />
        <Input label="Writing minutes" type="number" min={0} value={form.writingMinutes} onChange={(event) => updateNumber('writingMinutes', event.target.value)} />
        <Input label="Grammar minutes" type="number" min={0} value={form.grammarMinutes} onChange={(event) => updateNumber('grammarMinutes', event.target.value)} />
        <Input label="Vocabulary minutes" type="number" min={0} value={form.vocabularyMinutes} onChange={(event) => updateNumber('vocabularyMinutes', event.target.value)} />
        <Input label="New words learned" type="number" min={0} value={form.newWords} onChange={(event) => updateNumber('newWords', event.target.value)} />
        <Input label="Focus score" type="number" min={0} max={100} value={form.focusScore} onChange={(event) => updateNumber('focusScore', event.target.value)} />
        <Input label="Pronunciation score" type="number" min={0} max={100} value={form.pronunciationScore} onChange={(event) => updateNumber('pronunciationScore', event.target.value)} />
        <Input label="Grammar accuracy" type="number" min={0} max={100} value={form.grammarAccuracy} onChange={(event) => updateNumber('grammarAccuracy', event.target.value)} />
        <Select label="Mood" value={form.mood} options={moodOptions} onChange={(event) => setForm({ ...form, mood: event.target.value as Mood })} />
      </div>
      <label className="grid gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        Notes
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          className="min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save Session</Button>
      </div>
    </form>
  );
}
