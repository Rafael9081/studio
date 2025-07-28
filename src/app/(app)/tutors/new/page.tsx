import TutorForm from "@/components/forms/tutor-form";

export default function NewTutorPage() {
  return (
    <>
       <div className="page-header">
          <h2>Registrar um Novo Tutor</h2>
          <p>
            Preencha o formulário abaixo para adicionar um novo tutor ao seu sistema.
          </p>
        </div>
        <TutorForm />
    </>
  )
}
