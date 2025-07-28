import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Activity } from '@/lib/types';

export default function RecentActivityList({ items }: { items: Activity[] }) {
  if (items.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-muted-foreground">
        Nenhuma atividade recente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.link}
        >
            <div className="activity-item">
                <div className="activity-avatar">{item.avatarUrl ? <img src={item.avatarUrl} alt={item.title} className="w-full h-full rounded-full object-cover" /> : item.title.charAt(0)}</div>
                <div className="activity-info">
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-subtitle">{item.description}</div>
                </div>
                <div className="activity-time">{formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: ptBR })}</div>
            </div>
        </Link>
      ))}
    </div>
  );
}
