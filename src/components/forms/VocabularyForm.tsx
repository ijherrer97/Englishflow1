import { useState } from 'react';
import type { VocabularyStatus, VocabularyWord } from '../../types';
import { toDateKey } from '../../utils/dateHelpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface VocabularyFormProps {
  initial?: VocabularyWord;
  onSubmit: (word: VocabularyWord) => void;
  onCancel?: () => void;
}

const statusOptions = ['new', 'learning', 'mastered'].map((status) => ({ value: status, label: status }));

export function VocabularyForm({ initial, onSubmit, onCancel }: VocabularyFormProps) {
  const [form, setForm] = useState<VocabularyWord>(
    initial ?? {
      id: crypto.randomUUID(),
      word: '',
      meaning: '',
      example: '',
      category: '',
      dateAdded: toDateKey(),
      status: 'new',
    },
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Word" required value={form.word} onChange={(event) => setForm({ ...form, word: event.target.value })} />
        <Input label="Meaning" required value={form.meaning} onChange={(event) => setForm({ ...form, meaning: event.target.value })} />
        <Input label="Example sentence" value={form.example} onChange={(event) => setForm({ ...form, example: event.target.value })} />
        <Input label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
        <Input label="Date added" type="date" value={form.dateAdded} onChange={(event) => setForm({ ...form, dateAdded: event.target.value })} />
        <Select label="Status" value={form.status} options={statusOptions} onChange={(event) => setForm({ ...form, status: event.target.value as VocabularyStatus })} />
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save Word</Button>
      </div>
    </form>
  );
}
