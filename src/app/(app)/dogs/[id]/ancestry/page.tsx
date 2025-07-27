import { getDogById, getDogs } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, GitBranch } from "lucide-react";
import { Dog } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AncestryNodeProps {
  dog: Dog | null;
  allDogs: Dog[];
  isRoot?: boolean;
}

const AncestryNode: React.FC<AncestryNodeProps> = ({ dog, allDogs, isRoot = false }) => {
  if (!dog) {
    return (
      <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50 h-full min-h-[100px]">
        <span className="text-muted-foreground text-sm">Ancestral não registrado</span>
      </div>
    );
  }

  const father = dog.fatherId ? allDogs.find(d => d.id === dog.fatherId) : null;
  const mother = dog.motherId ? allDogs.find(d => d.id === dog.motherId) : null;

  return (
    <div className={cn("flex items-center", !isRoot && "flex-grow")}>
      <Link href={`/dogs/${dog.id}`} className="block w-full">
         <Card className={cn("hover:shadow-lg transition-shadow text-center w-full", isRoot ? "border-primary border-2" : "")}>
          <CardContent className="p-4">
            <Avatar className="mx-auto h-16 w-16 mb-2">
              <AvatarImage src={dog.avatar} alt={dog.name} />
              <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold">{dog.name}</p>
            <p className="text-xs text-muted-foreground">{dog.breed}</p>
          </CardContent>
        </Card>
      </Link>
      {(father || mother) && (
        <>
          <div className="w-8 md:w-16 h-px bg-border mx-2"></div>
          <div className="flex flex-col gap-8 w-full">
            {father && <AncestryNode dog={father} allDogs={allDogs} />}
            {mother && <AncestryNode dog={mother} allDogs={allDogs} />}
            {!father && <AncestryNode dog={null} allDogs={allDogs} />}
            {!mother && <AncestryNode dog={null} allDogs={allDogs} />}
          </div>
        </>
      )}
    </div>
  );
};

export default async function AncestryPage({ params }: { params: { id: string } }) {
  const [dog, allDogs] = await Promise.all([
    getDogById(params.id),
    getDogs()
  ]);
  
  if (!dog) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={`/dogs/${dog.id}`}>
            <ArrowLeft className="mr-2" />
            Voltar para Detalhes
          </Link>
        </Button>
        <div className="text-center">
             <h1 className="text-3xl font-bold font-headline">Árvore Genealógica</h1>
             <p className="text-muted-foreground">Ancestralidade de {dog.name}</p>
        </div>
        <div className="w-[170px]" /> 
      </div>
      
      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-start">
             <AncestryNode dog={dog} allDogs={allDogs} isRoot />
        </div>
      </Card>
    </div>
  );
}