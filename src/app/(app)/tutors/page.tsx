import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { getTutors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { TutorsDataTable } from "@/components/tutors/data-table";
import { columns } from "@/components/tutors/columns";

export default async function TutorsPage() {
  const tutors = await getTutors();

  return (
    <div className="flex flex-col gap-8">
      <div className="page-header flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-headline">Gerenciar Tutores</h2>
          <p className="text-muted-foreground">
            Adicione, edite ou exclua registros de tutores.
          </p>
        </div>
        <Button asChild className="add-button">
          <Link href="/tutors/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Tutor
          </Link>
        </Button>
      </div>
      <div className="dogs-table-section">
        <TutorsDataTable columns={columns} data={tutors} />
      </div>
    </div>
  );
}
