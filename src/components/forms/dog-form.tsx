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
import { addDog, updateDog } from "@/lib/data"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  breed: z.string().min(2, {
    message: "A raça deve ter pelo menos 2 caracteres.",
  }),
  sex: z.enum(["Macho", "Fêmea"]),
})

interface DogFormProps {
    dog?: Dog;
}

export default function DogForm({ dog }: DogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!dog;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dog?.name || "",
      breed: dog?.breed || "",
      sex: dog?.sex || "Macho",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditing) {
            await updateDog({ ...dog, ...values });
            toast({
                title: "Sucesso!",
                description: "Os detalhes do cão foram atualizados.",
            })
        } else {
            await addDog(values);
            toast({
                title: "Sucesso!",
                description: "Novo cão foi registrado.",
            })
        }
        router.push('/dogs');
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Buddy" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Raça</FormLabel>
                                <FormControl>
                                    <Input placeholder="Golden Retriever" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="sex"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sexo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o sexo" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Macho">Macho</SelectItem>
                                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit">{isEditing ? "Salvar Alterações" : "Registrar Cão"}</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
