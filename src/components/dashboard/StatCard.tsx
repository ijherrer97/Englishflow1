import type { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
}

export function StatCard({ title, value, subtitle, icon, gradient }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-soft ${gradient}`}>
      <div className="relative z-10 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/92 text-indigo-600 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white/85">{title}</p>
          <p className="mt-3 text-3xl font-black">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-white/85">
            <TrendingUp size={13} /> {subtitle}
          </p>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex h-12 items-end gap-1 opacity-40">
        {[18, 28, 34, 46, 56].map((height) => (
          <span key={height} className="w-1.5 rounded-full bg-white" style={{ height }} />
        ))}
      </div>
    </div>
  );
}
