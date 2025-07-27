import TutorForm from "@/components/forms/tutor-form";

export default function NewTutorPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar um Novo Tutor</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para adicionar um novo tutor ao seu sistema.
          </p>
        </div>
        <TutorForm />
    </div>
  )
}
