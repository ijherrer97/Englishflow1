import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StudySessionForm } from '../components/forms/StudySessionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import type { StudySession } from '../types';
import { formatDisplayDate, sortByDateDesc } from '../utils/dateHelpers';

interface RoutineProps {
  sessions: StudySession[];
  onSave: (session: StudySession) => void;
  onDelete: (id: string) => void;
}

export function Routine({ sessions, onSave, onDelete }: RoutineProps) {
  const [editing, setEditing] = useState<StudySession | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  function close() {
    setEditing(null);
    setIsAdding(false);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Routine</h1>
          <p className="text-slate-600 dark:text-slate-300">Create, edit and review your daily study sessions.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} icon={<Plus size={18} />}>Add Session</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Minutes</th>
                <th className="px-3 py-3">Skills</th>
                <th className="px-3 py-3">Words</th>
                <th className="px-3 py-3">Focus</th>
                <th className="px-3 py-3">Mood</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortByDateDesc(sessions).map((session) => (
                <tr key={session.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">{formatDisplayDate(session.date)}</td>
                  <td className="px-3 py-4">{session.totalMinutes}</td>
                  <td className="px-3 py-4 text-slate-500">
                    L {session.listeningMinutes} · S {session.speakingMinutes} · R {session.readingMinutes} · W {session.writingMinutes}
                  </td>
                  <td className="px-3 py-4">{session.newWords}</td>
                  <td className="px-3 py-4">{session.focusScore}%</td>
                  <td className="px-3 py-4 capitalize">{session.mood}</td>
                  <td className="px-3 py-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setEditing(session)} icon={<Edit3 size={16} />} aria-label="Edit session" />
                      <Button variant="danger" onClick={() => onDelete(session.id)} icon={<Trash2 size={16} />} aria-label="Delete session" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal title={editing ? 'Edit Session' : 'Add Session'} open={Boolean(editing) || isAdding} onClose={close}>
        <StudySessionForm
          initial={editing ?? undefined}
          onCancel={close}
          onSubmit={(session) => {
            onSave(session);
            close();
          }}
        />
      </Modal>
    </div>
  );
}
