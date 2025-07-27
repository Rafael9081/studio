import DashboardClient from "@/components/dashboard/dashboard-client";
import { getDogs, getSales, getTutors, getExpenses, getGeneralExpenses } from "@/lib/data";

export default async function DashboardPage() {
  const dogs = await getDogs();
  const tutors = await getTutors();
  const sales = await getSales();
  const dogExpenses = await getExpenses();
  const generalExpenses = await getGeneralExpenses();

  const allExpenses = [...dogExpenses, ...generalExpenses];
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Relatório Financeiro</h1>
        <p className="text-muted-foreground">
          Acompanhe as receitas e despesas do seu canil.
        </p>
      </div>
      <DashboardClient dogs={dogs} tutors={tutors} sales={sales} expenses={allExpenses} />
    </div>
  );
}
