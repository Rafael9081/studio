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
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
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
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditing) {
            updateTutor({ ...tutor, ...values });
            toast({
                title: "Success!",
                description: "Tutor details have been updated.",
            })
        } else {
            addTutor(values);
            toast({
                title: "Success!",
                description: "New tutor has been registered.",
            })
        }
        router.push('/tutors');
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
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">{isEditing ? "Save Changes" : "Register Tutor"}</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
