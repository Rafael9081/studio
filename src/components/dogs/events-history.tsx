'use client';

import React from 'react';
import { DogEvent } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Heart, Dog, Baby } from 'lucide-react';
import Link from 'next/link';

interface EventsHistoryProps {
  events: DogEvent[];
}

const eventIcons = {
  Cio: <Heart className="h-5 w-5 text-pink-500" />,
  Monta: <Dog className="h-5 w-5 text-blue-500" />,
  Parto: <Baby className="h-5 w-5 text-green-500" />,
};

function getEventDescription(event: DogEvent) {
    switch(event.type) {
        case 'Cio':
            return `Início do cio. ${event.notes || ''}`;
        case 'Monta':
            if (event.partnerName) {
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
        default:
            return event.notes || 'Evento registrado.';
    }
}


export default function EventsHistory({ events }: EventsHistoryProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
        Nenhum evento registrado para este cão.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            {eventIcons[event.type]}
          </div>
          <div className="flex-grow">
            <p className="font-semibold">{event.type}</p>
            <p className="text-sm text-muted-foreground">{getEventDescription(event)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
