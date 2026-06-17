'use client';

import { FolderKanban, Settings, Leaf } from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';

const navItems = [
  { href: '/projects', label: 'Projeler', icon: FolderKanban },
  { href: '/settings/jira', label: 'Jira Ayarları', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        {/* Logo / App name */}
        <div className="flex h-[60px] items-center gap-2 border-b border-sidebar-border px-5">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-semibold text-foreground">NexTest</span>
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
