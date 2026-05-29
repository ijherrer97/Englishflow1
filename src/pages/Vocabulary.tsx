import { CheckCircle2, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { VocabularyForm } from '../components/forms/VocabularyForm';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import type { VocabularyStatus, VocabularyWord } from '../types';
import { sortByDateDesc } from '../utils/dateHelpers';

interface VocabularyProps {
  words: VocabularyWord[];
  onSave: (word: VocabularyWord) => void;
  onDelete: (id: string) => void;
}

export function Vocabulary({ words, onSave, onDelete }: VocabularyProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editing, setEditing] = useState<VocabularyWord | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = useMemo(
    () =>
      sortByDateDesc(words).filter((word) => {
        const matchesQuery = [word.word, word.meaning, word.category].join(' ').toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === 'all' || word.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status, words],
  );

  function close() {
    setEditing(null);
    setIsAdding(false);
  }

  const mastered = words.filter((word) => word.status === 'mastered').length;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Vocabulary</h1>
          <p className="text-slate-600 dark:text-slate-300">Capture words, examples and mastery status.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} icon={<Plus size={18} />}>Add Word</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Total words</p><p className="text-3xl font-black text-slate-950 dark:text-white">{words.length}</p></Card>
        <Card><p className="text-sm text-slate-500">New words</p><p className="text-3xl font-black text-blue-600">{words.filter((word) => word.status === 'new').length}</p></Card>
        <Card><p className="text-sm text-slate-500">Mastered</p><p className="text-3xl font-black text-emerald-600">{mastered}</p></Card>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input label="Search" placeholder="Find a word..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select
            label="Filter"
            value={status}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'new', label: 'New' },
              { value: 'learning', label: 'Learning' },
              { value: 'mastered', label: 'Mastered' },
            ]}
            onChange={(event) => setStatus(event.target.value)}
          />
        </div>
        <div className="mt-5 grid gap-3">
          {filtered.map((word) => (
            <div key={word.id} className="grid gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">{word.word}</h2>
                  <Badge tone={word.status === 'mastered' ? 'green' : word.status === 'learning' ? 'violet' : 'blue'}>{word.status}</Badge>
                  <Badge>{word.category || 'General'}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{word.meaning}</p>
                <p className="mt-1 text-sm italic text-slate-500">{word.example}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => onSave({ ...word, status: 'mastered' as VocabularyStatus })} icon={<CheckCircle2 size={16} />} aria-label="Mark mastered" />
                <Button variant="secondary" onClick={() => setEditing(word)} icon={<Edit3 size={16} />} aria-label="Edit word" />
                <Button variant="danger" onClick={() => onDelete(word.id)} icon={<Trash2 size={16} />} aria-label="Delete word" />
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="grid place-items-center rounded-2xl bg-slate-50 p-10 text-slate-500 dark:bg-slate-800">
              <Search size={30} />
              <p className="mt-2 font-semibold">No words match this view.</p>
            </div>
          )}
        </div>
      </Card>

      <Modal title={editing ? 'Edit Word' : 'Add Word'} open={Boolean(editing) || isAdding} onClose={close}>
        <VocabularyForm
          initial={editing ?? undefined}
          onCancel={close}
          onSubmit={(word) => {
            onSave(word);
            close();
          }}
        />
      </Modal>
    </div>
  );
}
