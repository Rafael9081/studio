
'use client';

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { getTutors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { TutorsDataTable } from "@/components/tutors/data-table";
import { columns } from "@/components/tutors/columns";
import { useAuth } from "@/lib/auth.tsx";
import { Tutor } from "@/lib/types";

export default function TutorsPage() {
  const { role } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutors().then(data => {
      setTutors(data);
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
      <div className="page-header flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-headline">Gerenciar Tutores</h2>
          <p className="text-muted-foreground">
            Adicione, edite ou exclua registros de tutores.
          </p>
        </div>
        {role === 'admin' && (
            <Button asChild className="add-button">
            <Link href="/tutors/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Tutor
            </Link>
            </Button>
        )}
      </div>
      <div className="card dogs-table-section">
        <TutorsDataTable columns={columns} data={tutors} />
      </div>
    </div>
  );
}
