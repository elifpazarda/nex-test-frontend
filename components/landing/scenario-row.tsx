const CAT_STYLE: Record<string, { fg: string; bg: string }> = {
  happy_path: { fg: 'var(--palette-success-600)', bg: 'var(--palette-success-50)' },
  edge_case: { fg: 'var(--palette-warning-muted)', bg: 'var(--palette-warning-100)' },
  negative: { fg: 'var(--palette-danger-600)', bg: 'var(--palette-danger-50)' },
};

const PRI_STYLE: Record<string, { fg: string; bg: string }> = {
  critical: { fg: '#fff', bg: 'var(--palette-danger-600)' },
  high: { fg: 'var(--palette-danger-500)', bg: 'var(--palette-danger-100)' },
  medium: { fg: 'var(--palette-warning-muted)', bg: 'var(--palette-warning-100)' },
};

export function ScenarioRow({
  cat,
  pri,
  title,
  muted,
}: {
  cat: string;
  pri: string;
  title: string;
  muted?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-[100px_1fr_auto] items-center gap-3 border-b border-secondary px-1 py-[11px] text-[13.5px] last:border-0"
      style={{ opacity: muted ? 0.45 : 1 }}
    >
      <span
        className="inline-flex w-fit items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
        style={{ background: CAT_STYLE[cat]?.bg, color: CAT_STYLE[cat]?.fg }}
      >
        {cat.replace('_', ' ')}
      </span>
      <span className="text-foreground">{title}</span>
      <span
        className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
        style={{ background: PRI_STYLE[pri]?.bg, color: PRI_STYLE[pri]?.fg }}
      >
        {pri}
      </span>
    </div>
  );
}
