'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      {/* Left side — mobile app name (hidden on lg where sidebar shows it) */}
      <span className="text-lg font-bold lg:hidden">
        {process.env.NEXT_PUBLIC_APP_NAME ?? 'NexApp'}
      </span>

      {/* Spacer on desktop */}
      <div className="hidden lg:block" />

      {/* Right side — actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {user && (
          <>
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
            <Button variant="ghost" size="icon" aria-label="Cikis yap" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
