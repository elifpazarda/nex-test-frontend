import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">Aradiginiz sayfa bulunamadi</p>
      <Button asChild>
        <Link href="/projects">Ana Sayfaya Don</Link>
      </Button>
    </div>
  );
}
