'use client';

import * as React from 'react';

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[#1a1a18]">{label}</span>
      {children}
    </div>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <span className="text-[12px] text-[#9b2a2a]">{children}</span>;
}

/** shadcn select kurulu olmadigi icin Input stiline uyan yerel <select>. */
export function Select({
  className = '',
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <select
      className={`h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
