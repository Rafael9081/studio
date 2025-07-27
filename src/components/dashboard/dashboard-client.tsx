import RecentActivityList from './recent-activity-list';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dog, Users } from 'lucide-react';
import { Activity } from '@/lib/types';

interface DashboardClientProps {
  availableDogs: number;
  totalTutors: number;
  recentActivity: Activity[];
}

export default function DashboardClient({ availableDogs, totalTutors, recentActivity }: DashboardClientProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cães Disponíveis</CardTitle>
            <Dog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDogs}</div>
            <p className="text-xs text-muted-foreground">Total de cães à venda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tutores Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTutors}</div>
            <p className="text-xs text-muted-foreground">Total de clientes no sistema</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivityList items={recentActivity} />
        </CardContent>
      </Card>
    </>
  );
}
