import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-glow hover:scale-[1.01]',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
};

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
