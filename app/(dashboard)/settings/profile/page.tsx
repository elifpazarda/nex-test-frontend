'use client';

import { useAuth } from '@/hooks/use-auth';
import { Mail, Calendar, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const createdDate = new Date(user.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-[640px] px-8 py-10">
      <h1 className="font-heading text-[28px] font-medium tracking-tight text-foreground">
        Profil
      </h1>
      <p className="mt-1 text-[14px] text-muted-foreground">Hesap bilgilerin</p>

      <div className="mt-8 rounded-xl border border-border bg-white p-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--palette-brand-100)] text-[20px] font-semibold tracking-wide text-[var(--palette-brand-800)]">
            {initials}
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">{user.name}</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <hr className="my-6 border-[var(--palette-neutral-100)]" />

        {/* Info rows */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <UserIcon className="size-[16px] text-accent-foreground" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[var(--palette-neutral-400)]">Ad Soyad</p>
              <p className="text-[14px] font-medium text-foreground">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Mail className="size-[16px] text-accent-foreground" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[var(--palette-neutral-400)]">E-posta</p>
              <p className="text-[14px] font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Calendar className="size-[16px] text-accent-foreground" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[var(--palette-neutral-400)]">
                Kayıt tarihi
              </p>
              <p className="text-[14px] font-medium text-foreground">{createdDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
