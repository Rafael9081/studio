import LitterForm from "@/components/forms/litter-form";
import { getDogs } from "@/lib/data";

export default async function NewLitterPage() {
  const dogs = await getDogs();
  const maleDogs = dogs.filter(d => d.sex === 'Macho');
  const femaleDogs = dogs.filter(d => d.sex === 'Fêmea');

  return (
    <div className="flex flex-col gap-8">
      <div className="page-header">
        <h2>Registrar uma Nova Ninhada</h2>
        <p>Preencha o formulário abaixo para adicionar uma ninhada inteira de uma vez.</p>
      </div>
      <LitterForm maleDogs={maleDogs} femaleDogs={femaleDogs} />
    </div>
  )
}
