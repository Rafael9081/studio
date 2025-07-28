
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Dog, Tutor } from "@/lib/types"
import { recordSale } from "@/lib/data"
import { useAuth } from "@/lib/auth.tsx"


const formSchema = z.object({
  dogId: z.string({ required_error: "Por favor, selecione um cão." }),
  tutorId: z.string({ required_error: "Por favor, selecione um tutor." }),
  price: z.coerce.number().min(1, { message: "O preço deve ser maior que zero." }),
})

interface SaleFormProps {
    dogs: Dog[];
    tutors: Tutor[];
}

export default function SaleForm({ dogs, tutors }: SaleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (role !== 'admin') {
        toast({ title: "Acesso Negado", description: "Você não tem permissão para esta ação.", variant: "destructive" });
        return;
    }
    try {
        await recordSale({
            ...values,
            date: new Date(),
        });
        toast({
            title: "Sucesso!",
            description: "Venda registrada com sucesso. Você será redirecionado para o relatório financeiro.",
        });
        router.push(`/dogs/${values.dogId}/financials`);
        router.refresh();
    } catch (error) {
        toast({
            title: "Erro",
            description: "Algo deu errado. Por favor, tente novamente.",
            variant: "destructive"
        })
    }
  }

  const isReadOnly = role !== 'admin';

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="dogId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cão</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um cão" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {dogs.map(dog => (
                                    <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tutorId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tutor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um tutor" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {tutors.map(tutor => (
                                    <SelectItem key={tutor.id} value={tutor.id}>{tutor.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                        <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="1500" {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    {!isReadOnly && <Button type="submit">Registrar Venda</Button>}
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  )
}
