'use client';

import { LogOut, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Left side — mobile app name (hidden on lg where sidebar shows it) */}
      <div className="flex items-center gap-2 lg:hidden">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-heading text-lg font-semibold">NexTest</span>
      </div>

      {/* Spacer on desktop */}
      <div className="hidden lg:block" />

      {/* Right side — actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user && (
          <>
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              {user.name}
            </span>
            <Button variant="ghost" size="icon" aria-label="Cikis yap" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
