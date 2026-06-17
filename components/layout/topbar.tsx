'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/projects', label: 'Projeler' },
  { href: '/history', label: 'Geçmiş' },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-[200] flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Left: Brand + Nav */}
      <div className="flex items-center gap-6">
        <Link href="/projects" className="inline-flex items-center gap-2.5 no-underline">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="var(--palette-brand-600)" strokeWidth="1.6" />
            <path
              d="M10 21V11l12 10V11"
              stroke="var(--palette-brand-600)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-heading text-[16px] font-medium tracking-tight text-foreground">
            NexTest
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname.startsWith(link.href) || undefined}
              className="rounded-[6px] px-3 py-2 text-[13px] font-medium text-muted-foreground no-underline hover:bg-muted hover:text-foreground data-[active]:bg-accent data-[active]:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Profile Dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-sm px-2.5 py-2 transition-colors duration-100 hover:bg-[var(--palette-neutral-50)] focus:outline-none data-[state=open]:bg-[var(--palette-neutral-50)]">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--palette-brand-100)] text-[12px] font-semibold tracking-wide text-[var(--palette-brand-800)]">
                {initials}
              </span>
              <span className="text-[13.5px] font-medium text-foreground">{user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[240px] rounded-md border-[var(--palette-neutral-200)] bg-white p-1.5 shadow-[0_8px_30px_-8px_rgba(26,26,24,0.12)]"
          >
            <div className="px-2.5 py-2.5">
              <p className="text-[13.5px] font-semibold text-foreground">{user.name}</p>
              <p className="mt-0.5 text-[12px] text-[var(--palette-neutral-500)]">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-[var(--palette-neutral-100)]" />
            <Link href="/settings/profile" className="no-underline">
              <DropdownMenuItem className="mt-1 gap-2.5 rounded-sm px-2.5 py-2 text-[13px] font-medium text-[var(--palette-neutral-700)] focus:bg-[var(--palette-neutral-50)] focus:text-foreground">
                <UserIcon className="size-[15px] text-[var(--palette-neutral-500)]" />
                Profil
              </DropdownMenuItem>
            </Link>
            <Link href="/settings/jira" className="no-underline">
              <DropdownMenuItem className="gap-2.5 rounded-sm px-2.5 py-2 text-[13px] font-medium text-[var(--palette-neutral-700)] focus:bg-[var(--palette-neutral-50)] focus:text-foreground">
                <Settings className="size-[15px] text-[var(--palette-neutral-500)]" />
                Ayarlar
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-[var(--palette-neutral-100)]" />
            <DropdownMenuItem
              className="mb-0.5 mt-1 gap-2.5 rounded-sm px-2.5 py-2 text-[13px] font-medium text-[var(--palette-danger-600)] focus:bg-[var(--palette-danger-50)] focus:text-[var(--palette-danger-600)]"
              onClick={logout}
            >
              <LogOut className="size-[15px]" />
              Çıkış yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
