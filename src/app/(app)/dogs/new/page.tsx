import DogForm from "@/components/forms/dog-form";

export default function NewDogPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Register a New Dog</h1>
          <p className="text-muted-foreground">
            Fill out the form below to add a new dog to your kennel.
          </p>
        </div>
        <DogForm />
    </div>
  )
}
