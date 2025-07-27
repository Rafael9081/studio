'use client'

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Baby, PlusCircle, Trash, Upload, X } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Dog } from "@/lib/types"
import { addLitter } from "@/lib/data"
import { Separator } from "../ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const puppySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  sex: z.enum(["Macho", "Fêmea"]),
  avatar: z.any().optional(),
});

const formSchema = z.object({
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  breed: z.string().min(2, { message: "A raça deve ter pelo menos 2 caracteres."}),
  birthDate: z.date({ required_error: "É obrigatório inserir a data de nascimento."}),
  puppies: z.array(puppySchema).min(1, "Você deve adicionar pelo menos um filhote."),
})

export type PuppyData = z.infer<typeof puppySchema>;
export type LitterData = z.infer<typeof formSchema>;


interface LitterFormProps {
    maleDogs: Dog[];
    femaleDogs: Dog[];
}

export default function LitterForm({ maleDogs, femaleDogs }: LitterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      puppies: [],
      breed: ""
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "puppies"
  });

  const selectedMotherId = form.watch("motherId");

  React.useEffect(() => {
    if (selectedMotherId) {
        const mother = femaleDogs.find(d => d.id === selectedMotherId);
        if (mother) {
            form.setValue("breed", mother.breed);
        }
    }
  }, [selectedMotherId, femaleDogs, form]);
 
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError(`puppies.${index}.avatar`, { message: "A imagem não pode ter mais de 5MB." });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError(`puppies.${index}.avatar`, { message: "Apenas formatos .jpg, .jpeg, .png e .webp são aceitos." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(`puppies.${index}.avatar`, reader.result as string, { shouldValidate: true });
        form.clearErrors(`puppies.${index}.avatar`);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
        await addLitter(values);

        toast({
            title: "Sucesso!",
            description: "Ninhada registrada e filhotes adicionados ao sistema.",
        })
        router.push('/dogs');
        router.refresh();
    } catch (error) {
        toast({
            title: "Erro",
            description: "Algo deu errado ao registrar a ninhada. Por favor, tente novamente.",
            variant: "destructive"
        })
    } finally {
        setIsSubmitting(false);
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
                            name="fatherId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pai (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o pai" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
                                <FormLabel>Mãe (Opcional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a mãe" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {femaleDogs.map(dog => <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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
                                    <Input placeholder="Golden Retriever" {...field} disabled={isSubmitting}/>
                                </FormControl>
                                <FormDescription>
                                    Será preenchido automaticamente se a mãe for selecionada.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento da Ninhada</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(e.target.valueAsDate)} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator />

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Filhotes</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', sex: 'Macho' })}>
                                <PlusCircle className="mr-2" />
                                Adicionar Filhote
                            </Button>
                        </div>
                        
                        <div className="space-y-6">
                            {fields.map((field, index) => {
                                const imagePreview = form.watch(`puppies.${index}.avatar`);
                                return (
                                <Card key={field.id} className="p-4 bg-muted/50">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`puppies.${index}.avatar`}
                                            render={({ field: imageField }) => (
                                                <FormItem className="flex flex-col items-center justify-center gap-2">
                                                    <Avatar className="h-24 w-24 border">
                                                        <AvatarImage src={imagePreview} />
                                                        <AvatarFallback><Baby /></AvatarFallback>
                                                    </Avatar>
                                                     <Button type="button" size="sm" variant="outline" onClick={() => (document.querySelector(`input[name='puppies.${index}.avatar-input']`) as HTMLInputElement)?.click()}>
                                                        <Upload className="mr-2" />
                                                        Foto
                                                    </Button>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            className="hidden"
                                                            name={`puppies.${index}.avatar-input`}
                                                            onChange={(e) => handleImageChange(e, index)}
                                                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`puppies.${index}.name`}
                                                render={({ field: nameField }) => (
                                                    <FormItem>
                                                        <FormLabel>Nome do Filhote</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nome" {...nameField} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`puppies.${index}.sex`}
                                                render={({ field: sexField }) => (
                                                    <FormItem>
                                                        <FormLabel>Sexo</FormLabel>
                                                        <Select onValueChange={sexField.onChange} defaultValue={sexField.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue />
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
                                            <div className="sm:col-span-2 flex justify-end">
                                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                                    <Trash />
                                                    <span className="sr-only">Remover Filhote</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )})}
                            {form.formState.errors.puppies && fields.length === 0 && (
                               <p className="text-sm font-medium text-destructive">
                                   {form.formState.errors.puppies.message}
                               </p>
                            )}
                        </div>
                    </div>


                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting || fields.length === 0}>
                            {isSubmitting ? 'Registrando...' : 'Registrar Ninhada'}
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
