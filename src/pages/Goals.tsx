import { CheckCircle2, Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { GoalForm } from '../components/forms/GoalForm';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import type { Goal } from '../types';
import { getGoalCompletion } from '../utils/calculations';

interface GoalsProps {
  goals: Goal[];
  onSave: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export function Goals({ goals, onSave, onDelete }: GoalsProps) {
  const [editing, setEditing] = useState<Goal | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  function close() {
    setEditing(null);
    setIsAdding(false);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Goals</h1>
          <p className="text-slate-600 dark:text-slate-300">Set daily, weekly and skill-based targets.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} icon={<Plus size={18} />}>Add Goal</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const progress = getGoalCompletion(goal.current, goal.target);
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone={goal.status === 'completed' ? 'green' : goal.status === 'paused' ? 'slate' : 'blue'}>{goal.status}</Badge>
                  <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{goal.name}</h2>
                  <p className="text-sm text-slate-500">{goal.type.replace(/-/g, ' ')}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" onClick={() => onSave({ ...goal, status: 'completed', current: goal.target })} icon={<CheckCircle2 size={16} />} aria-label="Complete goal" />
                  <Button variant="ghost" onClick={() => setEditing(goal)} icon={<Edit3 size={16} />} aria-label="Edit goal" />
                  <Button variant="ghost" onClick={() => onDelete(goal.id)} icon={<Trash2 size={16} />} aria-label="Delete goal" />
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <p className="text-3xl font-black text-slate-950 dark:text-white">{progress}%</p>
                <p className="text-sm text-slate-500">{goal.current}/{goal.target} {goal.unit}</p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600" style={{ width: `${progress}%` }} />
              </div>
              {goal.deadline && <p className="mt-3 text-xs font-semibold text-slate-500">Deadline: {goal.deadline}</p>}
            </Card>
          );
        })}
      </div>

      <Modal title={editing ? 'Edit Goal' : 'Add Goal'} open={Boolean(editing) || isAdding} onClose={close}>
        <GoalForm
          initial={editing ?? undefined}
          onCancel={close}
          onSubmit={(goal) => {
            onSave(goal);
            close();
          }}
        />
      </Modal>
    </div>
  );
}
