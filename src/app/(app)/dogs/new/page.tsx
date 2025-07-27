import DogForm from "@/components/forms/dog-form";

export default function NewDogPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar um Novo Cão</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para adicionar um novo cão ao seu canil.
          </p>
        </div>
        <DogForm />
    </div>
  )
}
