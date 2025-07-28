
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PawPrint } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="relative flex items-center justify-center">
            <PawPrint className="text-primary animate-ping absolute inline-flex h-24 w-24 opacity-75" />
            <PawPrint className="relative inline-flex h-24 w-24 text-primary" />
        </div>
        <h1 className="mt-8 text-4xl font-bold text-foreground">Pawsome</h1>
        <p className="text-muted-foreground">Seu canil, simplificado.</p>
    </div>
  );
}
