import Link from 'next/link';
import { format, addDays, differenceInDays } from 'date-fns';
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
      {dogs.map((dog) => {
        if (!dog.matingDate) return null;
        const gestationStartDate = new Date(dog.matingDate);
        const today = new Date();
        const daysSinceMating = differenceInDays(today, gestationStartDate);
        const progress = Math.min(Math.max(Math.round((daysSinceMating / 63) * 100), 0), 100);

        return (
            <div key={dog.id} className="progress-item">
                <div className="progress-header">
                    <div className="activity-avatar">{dog.name.charAt(0)}</div>
                    <div className="progress-info">
                        <Link href={`/dogs/${dog.id}`} className="hover:underline">
                            <h4>{dog.name}</h4>
                        </Link>
                        <p>Parto: {format(addDays(gestationStartDate, 58), 'dd/MM')} - {format(addDays(gestationStartDate, 65), 'dd/MM')}</p>
                    </div>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-percentage">{progress}%</div>
            </div>
        )
      })}
    </div>
  );
}
