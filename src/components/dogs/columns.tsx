'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

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
    header: 'Name',
    cell: ({ row }) => {
        const dog = row.original;
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={dog.avatar} data-ai-hint="dog" alt={dog.name} />
                    <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{dog.name}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
  },
  {
    accessorKey: 'sex',
    header: 'Sex',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'Available' ? 'secondary' : 'default'}>
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

      const handleDelete = () => {
        // In a real app, you'd show a confirmation dialog first
        deleteDog(dog.id);
        toast({
            title: "Dog Deleted",
            description: `${dog.name} has been removed from the system.`,
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dogs/${dog.id}/edit`}>Edit Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
