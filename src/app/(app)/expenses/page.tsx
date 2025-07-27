import ExpenseForm from "@/components/forms/expense-form";
import { getDogs } from "@/lib/data";

export default async function ExpensesPage() {
  const dogs = await getDogs();

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar Despesa para um Cão</h1>
          <p className="text-muted-foreground">
            Selecione um cão para registrar uma nova despesa.
          </p>
        </div>
        <ExpenseForm dogs={dogs} />
    </div>
  )
}
