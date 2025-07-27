import TutorForm from "@/components/forms/tutor-form";
import { getTutorById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditTutorPage({ params }: { params: { id: string } }) {
  const tutor = getTutorById(params.id);

  if (!tutor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Edit Tutor Details</h1>
          <p className="text-muted-foreground">
            Update the information for {tutor.name}.
          </p>
        </div>
        <TutorForm tutor={tutor} />
    </div>
  )
}
