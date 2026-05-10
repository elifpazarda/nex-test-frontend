'use client';

import { FolderKanban, Settings } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';

const navItems = [
  { href: '/projects', label: 'Projeler', icon: FolderKanban },
  { href: '/settings/jira', label: 'Jira Ayarlari', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        {/* Logo / App name */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="text-lg font-bold text-sidebar-foreground">
            {process.env.NEXT_PUBLIC_APP_NAME ?? 'NexApp'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
