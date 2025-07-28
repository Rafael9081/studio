import FinancialsClient from "@/components/financials/financials-client";
import { getDogs, getSales, getExpenses, getGeneralExpenses, getTutors } from "@/lib/data";

export default async function FinancialsPage() {
  const dogs = await getDogs();
  const tutors = await getTutors();
  const sales = await getSales();
  const dogExpenses = await getExpenses();
  const generalExpenses = await getGeneralExpenses();

  const allExpenses = [...dogExpenses, ...generalExpenses];
  
  return (
    <div className="flex flex-col gap-8">
      <div className="page-header">
        <h2>Relatório Financeiro</h2>
        <p>Acompanhe as receitas e despesas do seu canil</p>
      </div>
      <FinancialsClient dogs={dogs} tutors={tutors} sales={sales} expenses={allExpenses} />
    </div>
  );
}
