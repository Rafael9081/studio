'use client';

import React, { useState, useEffect } from 'react';
import { DogEvent } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Heart, Dog, Baby, Syringe, Bug, Stethoscope, HeartPulse, LineChart } from 'lucide-react';
import Link from 'next/link';

interface EventsHistoryProps {
  events: DogEvent[];
}

const eventIcons: Record<DogEvent['type'], React.ReactNode> = {
  Cio: <Heart className="h-5 w-5 text-pink-500" />,
  Monta: <Dog className="h-5 w-5 text-blue-500" />,
  Parto: <Baby className="h-5 w-5 text-green-500" />,
  'Vacina': <Syringe className="h-5 w-5 text-blue-500" />,
  'Vermifugação': <Bug className="h-5 w-5 text-purple-500" />,
  'Consulta Veterinária': <Stethoscope className="h-5 w-5 text-teal-500" />,
  'Doença/Tratamento': <HeartPulse className="h-5 w-5 text-red-500" />,
  'Pesagem': <LineChart className="h-5 w-5 text-gray-500" />,
};

function getEventDescription(event: DogEvent) {
    switch(event.type) {
        case 'Cio':
            return `Início do cio. ${event.notes || ''}`;
        case 'Monta':
            if (event.partnerName && event.partnerId) {
                return (
                    <>
                        <span>Acalsamento com</span>
                        <Link href={`/dogs/${event.partnerId}`} className="font-semibold text-primary hover:underline mx-1">{event.partnerName}</Link>
                        <span>. {event.notes || ''}</span>
                    </>
                )
            }
            return `Acalsamento registrado. ${event.notes || ''}`;
        case 'Parto':
            return `${event.puppyCount || 0} filhotes nasceram. ${event.notes || ''}`;
        case 'Pesagem':
             return `Peso registrado: ${event.weight} kg. ${event.notes || ''}`
        default:
            return event.notes || 'Evento registrado.';
    }
}


export default function EventsHistory({ events }: EventsHistoryProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (events.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
        Nenhum evento registrado para este cão.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => {
        const date = event.date instanceof Date ? event.date : parseISO(event.date as unknown as string);
        const formattedDate = isClient ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';
        return (
            <div key={event.id} className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                {eventIcons[event.type]}
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{event.type}</p>
                <p className="text-sm text-muted-foreground">{getEventDescription(event)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                {isClient ? formattedDate : '...'}
                </p>
            </div>
            {event.weight && event.type !== 'Pesagem' && (
                <div className="text-sm font-medium text-right text-muted-foreground">
                    {event.weight} kg
                </div>
            )}
            </div>
        )
      })}
    </div>
  );
}
