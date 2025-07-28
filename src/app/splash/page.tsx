
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PawPrint } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 4000); // 4 seconds to allow for animation

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background overflow-hidden">
        <div className="relative flex items-center justify-center animate-fade-in-scale">
            <PawPrint className="text-primary animate-ping absolute inline-flex h-24 w-24 opacity-75" />
            <PawPrint className="relative inline-flex h-24 w-24 text-primary" />
        </div>
        <h1 className="mt-8 text-5xl font-bold text-foreground animate-slide-up-fade-in-1">Pawsome</h1>
        <p className="text-muted-foreground mt-2 animate-slide-up-fade-in-2">Seu canil, simplificado.</p>
        <div className="absolute bottom-10 text-center animate-slide-up-fade-in-3">
            <p className="text-sm text-muted-foreground">Powered by</p>
            <p className="text-lg font-semibold text-amber-500">🔥 Firebase</p>
        </div>
    </div>
  );
}
