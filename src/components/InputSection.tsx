import type { ReactNode } from 'react';

const iconColorMap = {
  blue: 'bg-accent-glow text-accent border-accent/20',
  gold: 'bg-gold-glow text-gold border-gold/20',
  green: 'bg-success-bg text-success border-success/20',
} as const;

interface InputSectionProps {
  title: string;
  icon: string;
  iconColor: 'blue' | 'gold' | 'green';
  children: ReactNode;
}

export default function InputSection({ title, icon, iconColor, children }: InputSectionProps) {
  return (
    <div className="mb-7">
      <div className="text-[13px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-3.5 pl-0.5">
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[11px] mr-2 align-middle border ${iconColorMap[iconColor]}`}>
          {icon}
        </span>
        {title}
      </div>
      <div className="bg-bg-card border border-border-default rounded-[14px] p-6 transition-colors duration-200 hover:border-accent/20">
        <div className="grid grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
