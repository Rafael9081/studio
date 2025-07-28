
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Dog } from '@/lib/types';
import { deleteDog } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth.tsx';

export const columns: ColumnDef<Dog>[] = [
   {
    id: "select",
    header: ({ table }) => {
      const { role } = useAuth();
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar tudo"
          disabled={role !== 'admin'}
        />
      );
    },
    cell: ({ row }) => {
       const { role } = useAuth();
       return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
            disabled={role !== 'admin'}
          />
       )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
        const dog = row.original;
        return (
            <Link href={`/dogs/${dog.id}`} className="flex items-center gap-3 group hover:underline">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={dog.avatar} data-ai-hint="dog" alt={dog.name} />
                    <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-base">{dog.name}</span>
            </Link>
        )
    }
  },
  {
    accessorKey: 'breed',
    header: 'Raça',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const getBadgeClass = () => {
        switch (status) {
            case 'Disponível':
                return 'status-disponivel';
            case 'Gestante':
                return 'status-gestante';
            case 'Vendido':
                return 'status-vendido';
            default:
                return '';
        }
      }
      return (
        <Badge className={cn('status-badge', getBadgeClass())}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const dog = row.original;
      const { toast } = useToast();
      const router = useRouter();
      const { role } = useAuth();

      const handleDelete = async () => {
        if (role !== 'admin') {
            toast({ title: "Acesso Negado", description: "Você não tem permissão para excluir.", variant: "destructive" });
            return;
        }
        await deleteDog(dog.id);
        toast({
            title: "Cão Deletado",
            description: `${dog.name} foi removido do sistema.`,
        });
        router.refresh();
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 actions-button">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
             <DropdownMenuItem asChild>
              <Link href={`/dogs/${dog.id}`}>Ver Detalhes</Link>
            </DropdownMenuItem>
            {role === 'admin' && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/dogs/${dog.id}/edit`}>Editar Detalhes</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    Excluir Registro
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
