import TutorForm from "@/components/forms/tutor-form";

export default function NewTutorPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Register a New Tutor</h1>
          <p className="text-muted-foreground">
            Fill out the form below to add a new tutor to your system.
          </p>
        </div>
        <TutorForm />
    </div>
  )
}
