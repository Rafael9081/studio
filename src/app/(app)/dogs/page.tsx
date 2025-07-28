import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { getDogs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { DogsDataTable } from "@/components/dogs/data-table";
import { columns } from "@/components/dogs/columns";

export default async function DogsPage() {
  const dogs = await getDogs();

  return (
    <div className="flex flex-col gap-8">
        <div className="page-header flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold font-headline">Gerenciar Cães</h2>
                <p className="text-muted-foreground">
                    Adicione, edite ou exclua registros de cães.
                </p>
            </div>
            <Button asChild className="add-button">
                <Link href="/dogs/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Cão
                </Link>
            </Button>
        </div>
        <div className="card dogs-table-section">
             <DogsDataTable columns={columns} data={dogs} />
        </div>
    </div>
  );
}
