'use client'

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

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
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  breed: z.string().min(2, {
    message: "A raça deve ter pelo menos 2 caracteres.",
  }),
  sex: z.enum(["Macho", "Fêmea"]),
  birthDate: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  specialCharacteristics: z.string().optional(),
  observations: z.string().optional(),
  avatar: z.any().optional(),
})

interface DogFormProps {
    dog?: Dog;
    allDogs: Dog[];
}

export default function DogForm({ dog, allDogs }: DogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!dog;
  const [imagePreview, setImagePreview] = useState<string | null>(dog?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const maleDogs = allDogs.filter(d => d.sex === 'Macho' && d.id !== dog?.id);
  const femaleDogs = allDogs.filter(d => d.sex === 'Fêmea' && d.id !== dog?.id);
  
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dog?.name || "",
      breed: dog?.breed || "",
      sex: dog?.sex || "Macho",
      birthDate: dog?.birthDate ? formatDateForInput(new Date(dog.birthDate)) : '',
      fatherId: dog?.fatherId || "",
      motherId: dog?.motherId || "",
      specialCharacteristics: dog?.specialCharacteristics || "",
      observations: dog?.observations || "",
      avatar: dog?.avatar || undefined,
    },
  })
 
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("avatar", { message: "A imagem não pode ter mais de 5MB." });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("avatar", { message: "Apenas formatos .jpg, .jpeg, .png e .webp são aceitos." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("avatar", reader.result as string);
        form.clearErrors("avatar");
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const dataToSubmit = {
      ...values,
      birthDate: values.birthDate ? new Date(values.birthDate) : undefined,
    };

    try {
        if (isEditing) {
            await updateDog({ id: dog.id, ...dataToSubmit });
            toast({
                title: "Sucesso!",
                description: "Os detalhes do cão foram atualizados.",
            })
            router.push(`/dogs/${dog.id}`);
        } else {
            const newDog = await addDog(dataToSubmit);
            toast({
                title: "Sucesso!",
                description: "Novo cão foi registrado.",
            })
            router.push(`/dogs/${newDog.id}`);
        }
        router.refresh();
    } catch (error) {
        toast({
            title: "Erro",
            description: "Algo deu errado. Por favor, tente novamente.",
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
                     <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center gap-4">
                                <Avatar className="h-32 w-32 border-4 border-muted">
                                    <AvatarImage src={imagePreview ?? undefined} alt="Avatar do Cão" />
                                    <AvatarFallback className="text-3xl">
                                        {dog?.name?.charAt(0) || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2" />
                                    {imagePreview ? 'Alterar Foto' : 'Enviar Foto'}
                                </Button>
                                {imagePreview && (
                                    <Button type="button" variant="destructive" onClick={() => {
                                        setImagePreview(null);
                                        form.setValue("avatar", undefined);
                                        if(fileInputRef.current) fileInputRef.current.value = "";
                                    }}>
                                        <X className="mr-2" />
                                        Remover
                                    </Button>
                                )}
                                </div>
                                <FormControl>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Buddy" {...field} disabled={isSubmitting} />
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
                                    <Input placeholder="Golden Retriever" {...field} disabled={isSubmitting}/>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isEditing}>
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
                                <FormDescription>{isEditing && "O sexo de um cão não pode ser alterado."}</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="date" 
                                            {...field} 
                                            disabled={isSubmitting} 
                                        />
                                    </FormControl>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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
                                    <Input placeholder="Ex: Pelagem tigrada, olhos azuis..." {...field} disabled={isSubmitting} />
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
                                    <Textarea placeholder="Descreva qualquer observação relevante sobre o cão..." {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (isEditing ? 'Salvando...' : 'Registrando...') : (isEditing ? "Salvar Alterações" : "Registrar Cão")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
