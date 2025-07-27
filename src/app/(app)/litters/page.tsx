import LitterForm from "@/components/forms/litter-form";
import { getDogs } from "@/lib/data";

export default async function NewLitterPage() {
  const dogs = await getDogs();
  const maleDogs = dogs.filter(d => d.sex === 'Macho');
  const femaleDogs = dogs.filter(d => d.sex === 'Fêmea');

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Registrar uma Nova Ninhada</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para adicionar uma ninhada inteira de uma vez.
          </p>
        </div>
        <LitterForm maleDogs={maleDogs} femaleDogs={femaleDogs} />
    </div>
  )
}
