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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gerenciar Cães</h1>
          <p className="text-muted-foreground">
            Adicione, edite ou exclua registros de cães.
          </p>
        </div>
        <Button asChild>
          <Link href="/dogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cão
          </Link>
        </Button>
      </div>
      <DogsDataTable columns={columns} data={dogs} />
    </div>
  );
}
