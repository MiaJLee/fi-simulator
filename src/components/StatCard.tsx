import type { StatCardVariant } from '@/types/simulation';

const variantStyles: Record<StatCardVariant, string> = {
  accent: 'before:bg-gradient-to-r before:from-accent before:to-transparent',
  gold: 'before:bg-gradient-to-r before:from-gold before:to-transparent',
  green: 'before:bg-gradient-to-r before:from-success before:to-transparent',
  warn: 'before:bg-gradient-to-r before:from-warning before:to-transparent',
};

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  variant: StatCardVariant;
}

export default function StatCard({ label, value, sub, variant }: StatCardProps) {
  return (
    <div className={`bg-bg-card border border-border-default rounded-xl p-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 ${variantStyles[variant]}`}>
      <div className="text-xs font-medium text-text-muted mb-2 uppercase tracking-[0.5px]">
        {label}
      </div>
      <div className="font-mono text-xl font-semibold text-text-primary">
        {value}
      </div>
      <div className="text-xs text-text-secondary mt-1">
        {sub}
      </div>
    </div>
  );
}
