import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDogs, getRecentActivity, getTutors } from "@/lib/data";
import { Dog, Users, HeartPulse } from "lucide-react";
import RecentActivityList from "@/components/dashboard/recent-activity-list";
import PregnantDogsList from "@/components/dashboard/pregnant-dogs-list";

export default async function DashboardPage() {
    const dogs = await getDogs();
    const tutors = await getTutors();
    const recentActivity = await getRecentActivity();

    const availableDogs = dogs.filter((dog) => dog.status === 'Disponível').length;
    const totalTutors = tutors.length;
    const pregnantDogs = dogs.filter(dog => dog.status === 'Gestante');

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                <p className="text-muted-foreground">
                    Um resumo rápido do seu canil.
                </p>
            </div>

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
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gestações em Andamento</CardTitle>
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pregnantDogs.length}</div>
                        <p className="text-xs text-muted-foreground">Total de cadelas prenhes</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentActivityList items={recentActivity} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Acompanhamento de Gestações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PregnantDogsList dogs={pregnantDogs} />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
