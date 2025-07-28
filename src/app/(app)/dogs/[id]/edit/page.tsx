import DogForm from "@/components/forms/dog-form";
import { getDogById, getDogs } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditDogPage({ params }: { params: { id: string } }) {
  const dog = await getDogById(params.id);
  const dogs = await getDogs();

  if (!dog) {
    notFound();
  }

  return (
    <>
      <div className="page-header">
        <h2>Editar Detalhes do Cão</h2>
        <p>Atualize as informações para {dog.name}.</p>
      </div>
      <DogForm dog={dog} allDogs={dogs} />
    </>
  )
}
