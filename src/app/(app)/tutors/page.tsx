import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { getTutors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { TutorsDataTable } from "@/components/tutors/data-table";
import { columns } from "@/components/tutors/columns";

export default function TutorsPage() {
  const tutors = getTutors();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Tutors</h1>
          <p className="text-muted-foreground">
            Add, edit, or delete tutor records.
          </p>
        </div>
        <Button asChild>
          <Link href="/tutors/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tutor
          </Link>
        </Button>
      </div>
      <TutorsDataTable columns={columns} data={tutors} />
    </div>
  );
}
