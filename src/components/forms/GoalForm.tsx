import { useState } from 'react';
import type { Goal, GoalStatus, GoalType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface GoalFormProps {
  initial?: Goal;
  onSubmit: (goal: Goal) => void;
  onCancel?: () => void;
}

const typeOptions: { value: GoalType; label: string }[] = [
  { value: 'daily-study-minutes', label: 'Daily study minutes' },
  { value: 'weekly-study-hours', label: 'Weekly study hours' },
  { value: 'new-vocabulary-words', label: 'New vocabulary words' },
  { value: 'speaking-practice-minutes', label: 'Speaking practice minutes' },
  { value: 'grammar-accuracy', label: 'Grammar accuracy' },
  { value: 'listening-practice', label: 'Listening practice' },
];

const statusOptions = ['active', 'completed', 'paused'].map((status) => ({ value: status, label: status }));

export function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [form, setForm] = useState<Goal>(
    initial ?? {
      id: crypto.randomUUID(),
      name: '',
      type: 'daily-study-minutes',
      target: 60,
      current: 0,
      unit: 'minutes',
      deadline: '',
      status: 'active',
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
        <Input label="Name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Select label="Type" value={form.type} options={typeOptions} onChange={(event) => setForm({ ...form, type: event.target.value as GoalType })} />
        <Input label="Target" type="number" min={0} value={form.target} onChange={(event) => setForm({ ...form, target: Number(event.target.value) })} />
        <Input label="Current progress" type="number" min={0} value={form.current} onChange={(event) => setForm({ ...form, current: Number(event.target.value) })} />
        <Input label="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
        <Input label="Deadline" type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
        <Select label="Status" value={form.status} options={statusOptions} onChange={(event) => setForm({ ...form, status: event.target.value as GoalStatus })} />
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save Goal</Button>
      </div>
    </form>
  );
}
