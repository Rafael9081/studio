
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
import { addGeneralExpense } from "@/lib/data"
import { Textarea } from "../ui/textarea"
import { useAuth } from "@/lib/auth.tsx"


const formSchema = z.object({
  type: z.enum(["Material", "Serviços", "Funcionários", "Outras"]),
  description: z.string().min(2, { message: "A descrição deve ter pelo menos 2 caracteres."}),
  amount: z.coerce.number().min(1, { message: "O valor deve ser maior que zero." }),
})

export default function GeneralExpenseForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        amount: 0,
        type: "Outras",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (role !== 'admin') {
        toast({ title: "Acesso Negado", description: "Você não tem permissão para esta ação.", variant: "destructive" });
        return;
    }
    try {
        await addGeneralExpense({
            ...values,
            date: new Date(),
        });
        toast({
            title: "Sucesso!",
            description: "Despesa geral registrada com sucesso.",
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
  
  const isReadOnly = role !== 'admin';

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo de Despesa</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Material">Material</SelectItem>
                                    <SelectItem value="Serviços">Serviços</SelectItem>
                                    <SelectItem value="Funcionários">Funcionários</SelectItem>
                                    <SelectItem value="Outras">Outras</SelectItem>
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
                                <Input type="number" placeholder="100" {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descreva a despesa..." {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    {!isReadOnly && <Button type="submit">Registrar Despesa</Button>}
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  )
}
