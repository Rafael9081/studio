import SaleForm from "@/components/forms/sale-form";
import { getDogs, getTutors } from "@/lib/data";

export default async function SalesPage() {
  const allDogs = await getDogs();
  const tutors = await getTutors();

  const availableDogs = allDogs.filter(dog => dog.status === 'Disponível');

  return (
    <>
      <div className="page-header">
        <h2>Registrar uma Venda</h2>
        <p>Selecione um cão e um tutor para registrar uma nova venda.</p>
      </div>
      <SaleForm dogs={availableDogs} tutors={tutors} />
    </>
  )
}
