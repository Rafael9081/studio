
import ExpenseForm from "@/components/forms/expense-form";
import { getDogs } from "@/lib/data";

export default async function ExpensesPage() {
  const dogs = await getDogs();

  return (
    <div className="flex flex-col gap-8">
      <div className="page-header">
        <h2>Registrar Despesa para um Cão</h2>
        <p>Selecione um cão para registrar uma nova despesa.</p>
      </div>
      <ExpenseForm dogs={dogs} />
    </div>
  )
}

    