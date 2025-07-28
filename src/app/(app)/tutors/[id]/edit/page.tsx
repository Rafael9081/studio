import TutorForm from "@/components/forms/tutor-form";
import { getTutorById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditTutorPage({ params }: { params: { id: string } }) {
  const tutor = await getTutorById(params.id);

  if (!tutor) {
    notFound();
  }

  return (
    <>
      <div className="page-header">
        <h2>Editar Detalhes do Tutor</h2>
        <p>Atualize as informações para {tutor.name}.</p>
      </div>
      <TutorForm tutor={tutor} />
    </>
  )
}
