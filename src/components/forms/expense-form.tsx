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
import type { Dog } from "@/lib/types"
import { addExpense } from "@/lib/data"
import { Textarea } from "../ui/textarea"


const formSchema = z.object({
  dogId: z.string({ required_error: "Por favor, selecione um cão." }),
  type: z.enum(["Alimentação", "Vacinas", "Veterinário", "Geral"]),
  description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres."}),
  amount: z.coerce.number().min(1, { message: "O valor deve ser maior que zero." }),
})

interface ExpenseFormProps {
    dogs: Dog[];
}

export default function ExpenseForm({ dogs }: ExpenseFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        amount: 0,
        type: "Geral",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await addExpense({
            ...values,
            date: new Date(),
        });
        toast({
            title: "Sucesso!",
            description: "Despesa registrada com sucesso.",
        });
        router.push('/dashboard');
        router.refresh();
    } catch (error) {
        toast({
            title: "Erro",
            description: "Algo deu errado. Por favor, tente novamente.",
            variant: "destructive"
        })
    }
  }

  return (
    <Card>
        <CardContent className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="dogId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cão</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tipo de Despesa</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Alimentação">Alimentação</SelectItem>
                                        <SelectItem value="Vacinas">Vacinas</SelectItem>
                                        <SelectItem value="Veterinário">Veterinário</SelectItem>
                                        <SelectItem value="Geral">Geral</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Valor (R$)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Ração premium para filhotes..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit">Registrar Despesa</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
