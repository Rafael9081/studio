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
    message: "Name must be at least 2 characters.",
  }),
  breed: z.string().min(2, {
    message: "Breed must be at least 2 characters.",
  }),
  sex: z.enum(["Male", "Female"]),
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
      sex: dog?.sex || "Male",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditing) {
            updateDog({ ...dog, ...values });
            toast({
                title: "Success!",
                description: "Dog details have been updated.",
            })
        } else {
            addDog(values);
            toast({
                title: "Success!",
                description: "New dog has been registered.",
            })
        }
        router.push('/dogs');
        router.refresh();
    } catch (error) {
        toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
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
                                <FormLabel>Name</FormLabel>
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
                                <FormLabel>Breed</FormLabel>
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
                                <FormLabel>Sex</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sex" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">{isEditing ? "Save Changes" : "Register Dog"}</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
