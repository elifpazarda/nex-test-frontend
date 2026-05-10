'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects } from './_hooks/use-projects';

export default function ProjectsPage() {
  const { user } = useProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hosgeldin{user ? `, ${user.name}` : ''}</h1>

      <p className="text-muted-foreground">
        Projeleriniz burada listelenecek. Backend baglandiginda veriler gelecek.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              + Yeni Proje Olustur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ilk projenizi olusturarak test senaryolari uretmeye baslayin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
