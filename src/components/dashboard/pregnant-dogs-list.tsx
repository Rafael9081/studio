import Link from 'next/link';
import { format, addDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dog } from '@/lib/types';
import { Button } from '../ui/button';

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
      {dogs.map((dog) => (
        <Link
          key={dog.id}
          href={`/dogs/${dog.id}`}
          className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={dog.avatar} alt={dog.name} />
              <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-medium">{dog.name}</p>
                {dog.matingDate && (
                    <p className="text-sm text-primary">
                        Parto: {format(addDays(new Date(dog.matingDate), 58), 'dd/MM')} - {format(addDays(new Date(dog.matingDate), 65), 'dd/MM')}
                    </p>
                )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
