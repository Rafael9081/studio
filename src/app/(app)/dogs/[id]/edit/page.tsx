import DogForm from "@/components/forms/dog-form";
import { getDogById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditDogPage({ params }: { params: { id: string } }) {
  const dog = getDogById(params.id);

  if (!dog) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Edit Dog Details</h1>
          <p className="text-muted-foreground">
            Update the information for {dog.name}.
          </p>
        </div>
        <DogForm dog={dog} />
    </div>
  )
}
