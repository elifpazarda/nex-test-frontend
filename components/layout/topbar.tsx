'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { href: '/projects', label: 'Projeler' },
  { href: '/history', label: 'Gecmis' },
  { href: '/settings/jira', label: 'Ayarlar' },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-[200] flex h-16 items-center justify-between border-b border-[#e8e1cf] bg-white px-6">
      {/* Left: Brand + Nav */}
      <div className="flex items-center gap-6">
        <Link href="/projects" className="inline-flex items-center gap-2.5 no-underline">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="#1F6F4E" strokeWidth="1.6" />
            <path
              d="M10 21V11l12 10V11"
              stroke="#1F6F4E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-heading text-[16px] font-medium tracking-tight text-[#1a1a18]">
            NexTest
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname.startsWith(link.href) || undefined}
              className="rounded-[6px] px-3 py-2 text-[13px] font-medium text-[#5c5a52] no-underline hover:bg-[#fbf8f1] hover:text-[#1a1a18] data-[active]:bg-[#ecf5f0] data-[active]:text-[#1a5a40]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold tracking-wide"
              style={{ background: '#d4e9dd', color: '#154832' }}
            >
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <button
              onClick={logout}
              className="rounded-[6px] px-2.5 py-1.5 text-[13px] font-medium text-[#5c5a52] hover:bg-[#f4efe3] hover:text-[#1a1a18]"
            >
              Cikis
            </button>
          </>
        )}
      </div>
    </header>
  );
}
