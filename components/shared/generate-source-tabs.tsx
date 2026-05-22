import Link from 'next/link';

type GenerateSource = 'text' | 'jira' | 'excel' | 'pdf';

const TABS: { source: GenerateSource; label: string; segment: string }[] = [
  { source: 'text', label: 'Metin', segment: '' },
  { source: 'jira', label: 'Jira', segment: '/jira' },
  { source: 'excel', label: 'Excel', segment: '/excel' },
  { source: 'pdf', label: 'PDF', segment: '/pdf' },
];

/** Generate akislari arasinda gecis yapan sekme cubugu */
export function GenerateSourceTabs({
  projectId,
  active,
}: {
  projectId: string;
  active: GenerateSource;
}) {
  return (
    <nav className="mb-6 inline-flex gap-1 rounded-[10px] bg-[#f4efe3] p-1">
      {TABS.map((tab) =>
        tab.source === active ? (
          <span
            key={tab.source}
            className="rounded-[8px] bg-[#1f6f4e] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_3px_rgba(26,26,24,0.06)]"
          >
            {tab.label}
          </span>
        ) : (
          <Link
            key={tab.source}
            href={`/projects/${projectId}/generate${tab.segment}`}
            className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline hover:bg-[#ece5d3]"
          >
            {tab.label}
          </Link>
        ),
      )}
    </nav>
  );
}
