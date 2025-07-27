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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Tutor } from '@/lib/types';
import { deleteTutor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export const columns: ColumnDef<Tutor>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
        const tutor = row.original;
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={tutor.avatar} data-ai-hint="person" alt={tutor.name} />
                    <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{tutor.name}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'phone',
    header: 'Número de Telefone',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tutor = row.original;
      const { toast } = useToast();
      const router = useRouter();

      const handleDelete = async () => {
        await deleteTutor(tutor.id);
        toast({
            title: "Tutor Deletado",
            description: `${tutor.name} foi removido do sistema.`,
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
              <Link href={`/tutors/${tutor.id}/edit`}>Editar Detalhes</Link>
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
