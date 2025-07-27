'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  breed: z.string().min(2, {
    message: "A raça deve ter pelo menos 2 caracteres.",
  }),
  sex: z.enum(["Macho", "Fêmea"]),
  birthDate: z.date().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  specialCharacteristics: z.string().optional(),
  observations: z.string().optional(),
})

interface DogFormProps {
    dog?: Dog;
    allDogs: Dog[];
}

export default function DogForm({ dog, allDogs }: DogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!dog;

  const maleDogs = allDogs.filter(d => d.sex === 'Macho' && d.id !== dog?.id);
  const femaleDogs = allDogs.filter(d => d.sex === 'Fêmea' && d.id !== dog?.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dog?.name || "",
      breed: dog?.breed || "",
      sex: dog?.sex || "Macho",
      birthDate: dog?.birthDate,
      fatherId: dog?.fatherId || "",
      motherId: dog?.motherId || "",
      specialCharacteristics: dog?.specialCharacteristics || "",
      observations: dog?.observations || "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditing) {
            await updateDog({ id: dog.id, ...values });
            toast({
                title: "Sucesso!",
                description: "Os detalhes do cão foram atualizados.",
            })
            router.push(`/dogs/${dog.id}`);
        } else {
            await addDog(values);
            toast({
                title: "Sucesso!",
                description: "Novo cão foi registrado.",
            })
            router.push('/dogs');
        }
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
                         <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data de Nascimento</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ptBR})
                                      ) : (
                                        <span>Escolha uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    locale={ptBR}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                            control={form.control}
                            name="fatherId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pai</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o pai (opcional)" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="unknown">Não identificado</SelectItem>
                                      {maleDogs.map(dog => <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="motherId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mãe</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a mãe (opcional)" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="unknown">Não identificada</SelectItem>
                                       {femaleDogs.map(dog => <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="specialCharacteristics"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Características Especiais</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Pelagem tigrada, olhos azuis..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Observações Gerais</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Descreva qualquer observação relevante sobre o cão..." {...field} />
                                </FormControl>
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
