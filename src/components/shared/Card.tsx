import React from 'react';

export const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
}) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200',
    warning: 'bg-amber-50 text-amber-600 border border-amber-200',
    info: 'bg-sky-50 text-sky-600 border border-sky-200',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
