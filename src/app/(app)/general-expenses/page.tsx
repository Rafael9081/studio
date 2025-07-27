import GeneralExpenseForm from "@/components/forms/general-expense-form";

export default async function GeneralExpensesPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar Despesa Geral</h1>
          <p className="text-muted-foreground">
            Use o formulário abaixo para registrar uma despesa do canil.
          </p>
        </div>
        <GeneralExpenseForm />
    </div>
  )
}
