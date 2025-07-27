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

export const columns: ColumnDef<Dog>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
        const dog = row.original;
        return (
            <Link href={`/dogs/${dog.id}`} className="flex items-center gap-3 group hover:underline">
                <Avatar>
                    <AvatarImage src={dog.avatar} data-ai-hint="dog" alt={dog.name} />
                    <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{dog.name}</span>
            </Link>
        )
    }
  },
  {
    accessorKey: 'breed',
    header: 'Raça',
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Disponível' ? 'secondary' : 'default';
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const dog = row.original;
      const { toast } = useToast();
      const router = useRouter();

      const handleDelete = async () => {
        // In a real app, you'd show a confirmation dialog first
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
             <DropdownMenuItem asChild>
              <Link href={`/dogs/${dog.id}`}>Ver Detalhes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dogs/${dog.id}/edit`}>Editar Detalhes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                Excluir Registro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
