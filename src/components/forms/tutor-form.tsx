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
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Tutor } from "@/lib/types"
import { addTutor, updateTutor } from "@/lib/data"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "O número de telefone deve ter pelo menos 10 caracteres.",
  }),
})

interface TutorFormProps {
    tutor?: Tutor;
}

export default function TutorForm({ tutor }: TutorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!tutor;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tutor?.name || "",
      phone: tutor?.phone || "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditing) {
            await updateTutor({ ...tutor, ...values });
            toast({
                title: "Sucesso!",
                description: "Os detalhes do tutor foram atualizados.",
            })
        } else {
            await addTutor(values);
            toast({
                title: "Sucesso!",
                description: "Novo tutor foi registrado.",
            })
        }
        router.push('/tutors');
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
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Número de Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit">{isEditing ? "Salvar Alterações" : "Registrar Tutor"}</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
