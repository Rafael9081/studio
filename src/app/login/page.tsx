
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PawPrint, Mail, KeyRound, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Loading from '../(app)/loading';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loading />
        </div>
    )
  }

  if (user) {
    router.push('/dashboard');
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loading />
        </div>
    )
  }


  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signInUser(data.email, data.password);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Você será redirecionado para o dashboard.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro desconhecido. Tente novamente.';
       if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
       } else if(error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do email é inválido.';
      }
      toast({
        title: 'Erro de Login',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <PawPrint className="mx-auto h-12 w-auto text-primary" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Bem-vindo de volta ao Pawsome!
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
                 <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                    <Input
                        id="email-address"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10"
                        placeholder="Endereço de email"
                        {...register('email')}
                    />
                </div>
                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                
                <div className="relative pt-4">
                     <KeyRound className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="pl-10"
                        placeholder="Senha"
                        {...register('password')}
                    />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
                <Button type="submit" className="w-full login-button" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <LogIn className="mr-2" />
                            Entrar
                        </>
                    )}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
