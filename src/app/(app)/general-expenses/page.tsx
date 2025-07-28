import GeneralExpenseForm from "@/components/forms/general-expense-form";

export default async function GeneralExpensesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="page-header">
        <h2>Registrar Despesa Geral</h2>
        <p>Use o formulário abaixo para registrar uma despesa do canil.</p>
      </div>
      <GeneralExpenseForm />
    </div>
  )
}
