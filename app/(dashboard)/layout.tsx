import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffdf8]">
      <Topbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
