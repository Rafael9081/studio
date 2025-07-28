import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { getDogs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { DogsDataTable } from "@/components/dogs/data-table";
import { columns } from "@/components/dogs/columns";
import { DogsTableToolbar } from "@/components/dogs/data-table-toolbar";

export default async function DogsPage() {
  const dogs = await getDogs();

  return (
    <div className="flex flex-col gap-8">
        <div className="card">
             <DogsDataTable columns={columns} data={dogs} />
        </div>
    </div>
  );
}
