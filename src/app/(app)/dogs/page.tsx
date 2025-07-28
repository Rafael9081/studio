
'use client';

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { getDogs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { DogsDataTable } from "@/components/dogs/data-table";
import { columns } from "@/components/dogs/columns";
import { useAuth } from "@/lib/auth.tsx";
import { Dog } from "@/lib/types";

export default function DogsPage() {
  const { role } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDogs().then(data => {
      setDogs(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold font-headline">Gerenciar Cães</h2>
                <p className="text-muted-foreground">
                    Adicione, edite ou exclua registros de cães.
                </p>
            </div>
            {role === 'admin' && (
                <Button asChild className="add-button w-full md:w-auto">
                    <Link href="/dogs/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Cão
                    </Link>
                </Button>
            )}
        </div>
        <div className="card dogs-table-section">
             <DogsDataTable columns={columns} data={dogs} />
        </div>
    </div>
  );
}
