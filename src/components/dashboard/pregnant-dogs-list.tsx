import Link from 'next/link';
import { format, addDays, differenceInDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dog } from '@/lib/types';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export default function PregnantDogsList({ dogs }: { dogs: Dog[] }) {
  if (dogs.length === 0) {
    return (
      <div className="flex h-24 flex-col items-center justify-center text-center text-muted-foreground">
        <p>Nenhuma gestação em andamento.</p>
         <Button variant="link" asChild className="mt-2">
            <Link href="/dogs">Registrar gestação</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dogs.map((dog) => {
        if (!dog.matingDate) return null;
        const gestationStartDate = new Date(dog.matingDate);
        const today = new Date();
        const daysSinceMating = differenceInDays(today, gestationStartDate);
        const progress = Math.min(Math.max(Math.round((daysSinceMating / 63) * 100), 0), 100);

        return (
          <Link
            key={dog.id}
            href={`/dogs/${dog.id}`}
            className="block rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={dog.avatar} alt={dog.name} />
                <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-grow">
                  <p className="font-semibold">{dog.name}</p>
                  <p className="text-sm text-primary">
                      Parto: {format(addDays(gestationStartDate, 58), 'dd/MM')} - {format(addDays(gestationStartDate, 65), 'dd/MM')}
                  </p>
              </div>
            </div>
             <div className="flex items-center gap-2">
                <Progress value={progress} className="w-full h-2" />
                <span className="text-xs font-semibold text-muted-foreground">{progress}%</span>
             </div>
          </Link>
        )
      })}
    </div>
  );
}
