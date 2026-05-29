import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'violet' | 'coral' | 'slate';
}

const tones = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200',
  coral: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

export function Badge({ children, tone = 'slate' }: BadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
