import DashboardClient from "@/components/dashboard/dashboard-client";
import { getDogs, getSales, getTutors, getExpenses } from "@/lib/data";

export default async function DashboardPage() {
  const dogs = await getDogs();
  const tutors = await getTutors();
  const sales = await getSales();
  const expenses = await getExpenses();
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Painel</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu gerenciador de canil. Aqui está um resumo de suas operações.
        </p>
      </div>
      <DashboardClient dogs={dogs} tutors={tutors} sales={sales} expenses={expenses} />
    </div>
  );
}
