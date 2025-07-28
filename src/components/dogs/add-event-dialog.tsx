'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDogEvent } from '@/lib/data';
import { Dog } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

interface AddEventDialogProps {
  dog: Dog;
  maleDogs: Dog[];
}

const formSchema = z.object({
  type: z.enum(['Cio', 'Monta', 'Parto', 'Vacina', 'Vermifugação', 'Consulta Veterinária', 'Doença/Tratamento', 'Pesagem']),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
  notes: z.string().optional(),
  partnerId: z.string().optional(),
  puppyCount: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
});

export default function AddEventDialog({ dog, maleDogs }: AddEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: dog.sex === 'Macho' ? 'Monta' : 'Cio',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      partnerId: '',
      puppyCount: 0,
      weight: 0,
    },
  });

  const eventType = form.watch('type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const partnerName = values.partnerId ? maleDogs.find(d => d.id === values.partnerId)?.name : undefined;

      await addDogEvent({
        dogId: dog.id,
        ...values,
        date: new Date(values.date),
        partnerName
      });

      toast({
        title: 'Sucesso!',
        description: `Evento "${values.type}" registrado para ${dog.name}.`,
      });
      
      form.reset();
      setIsOpen(false);
      

      if (values.type === 'Parto') {
        router.push('/litters/new');
      } else {
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o evento.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2" />
          Registrar Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Novo Evento para {dog.name}</DialogTitle>
          <DialogDescription>
            Selecione o tipo de evento e preencha os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Reprodutivo</SelectLabel>
                          {dog.sex === 'Fêmea' && <SelectItem value="Cio">Cio</SelectItem>}
                          <SelectItem value="Monta">Monta</SelectItem>
                          {dog.sex === 'Fêmea' && <SelectItem value="Parto">Parto</SelectItem>}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Saúde</SelectLabel>
                          <SelectItem value="Vacina">Vacina</SelectItem>
                          <SelectItem value="Vermifugação">Vermifugação</SelectItem>
                          <SelectItem value="Consulta Veterinária">Consulta Veterinária</SelectItem>
                          <SelectItem value="Doença/Tratamento">Doença/Tratamento</SelectItem>
                          <SelectItem value="Pesagem">Pesagem</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Data do Evento</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.1" placeholder="15.5" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            {eventType === 'Monta' && dog.sex === 'Fêmea' && (
              <FormField
                control={form.control}
                name="partnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Macho Parceiro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o parceiro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maleDogs.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             {eventType === 'Parto' && (
              <FormField
                control={form.control}
                name="puppyCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Filhotes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adicione qualquer observação relevante..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
