import SaleForm from "@/components/forms/sale-form";
import { getDogs, getTutors } from "@/lib/data";

export default async function SalesPage() {
  const allDogs = await getDogs();
  const tutors = await getTutors();

  const availableDogs = allDogs.filter(dog => dog.status === 'Disponível');

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar uma Venda</h1>
          <p className="text-muted-foreground">
            Selecione um cão e um tutor para registrar uma nova venda.
          </p>
        </div>
        <SaleForm dogs={availableDogs} tutors={tutors} />
    </div>
  )
}
