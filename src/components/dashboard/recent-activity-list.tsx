import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Dog, DollarSign, Wallet, Briefcase } from 'lucide-react';

import { Activity } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'dog_added':
      return <Dog className="h-5 w-5" />;
    case 'expense_added':
      return <Wallet className="h-5 w-5 text-red-500" />;
    case 'general_expense_added':
      return <Briefcase className="h-5 w-5 text-red-500" />;
    case 'sale_added':
      return <DollarSign className="h-5 w-5 text-green-500" />;
    default:
      return <Dog className="h-5 w-5" />;
  }
}

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
          className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={item.avatarUrl} alt={item.title} />
              <AvatarFallback>{getActivityIcon(item.type)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {item.amount && (
                <Badge variant={item.type === 'sale_added' ? 'secondary' : 'destructive'} className={cn(
                    item.type === 'sale_added' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
                    (item.type === 'expense_added' || item.type === 'general_expense_added') && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                )}>
                 {item.type === 'sale_added' ? '+' : '-'} {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Badge>
            )}
             <p className="hidden text-sm text-muted-foreground md:block">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: ptBR })}
             </p>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
