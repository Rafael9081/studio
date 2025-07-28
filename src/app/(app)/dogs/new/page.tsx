import DogForm from "@/components/forms/dog-form";
import { getDogs } from "@/lib/data";

export default async function NewDogPage() {
  const dogs = await getDogs();

  return (
    <>
      <div className="page-header">
        <h2>Registrar um Novo Cão</h2>
        <p>Preencha o formulário abaixo para adicionar um novo cão ao seu canil.</p>
      </div>
      <DogForm allDogs={dogs} />
    </>
  )
}
