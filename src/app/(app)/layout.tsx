
'use client';

import { type ReactNode, useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import MainNav from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { useRequireAuth, useAuth } from '@/lib/auth.tsx';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function SidebarToggleButton() {
    const { state, toggleSidebar } = useSidebar();
    const { toast } = useToast();
    const router = useRouter();
    const auth = getAuth();

    const handleLogout = async () => {
        await signOut(auth);
        toast({
            title: 'Logout',
            description: 'Você saiu da sua conta.',
        });
        router.push('/login');
    };

    if (state === 'collapsed') {
        return (
            <div className="flex flex-col gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-full justify-center"
                    onClick={toggleSidebar}
                >
                    <PanelLeftOpen />
                    <span className="sr-only">Expandir</span>
                </Button>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="w-full justify-center"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span className="sr-only">Sair</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="w-full justify-center"
                onClick={toggleSidebar}
            >
                <PanelLeftClose />
                <span className="sr-only">Recolher</span>
            </Button>
            <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={handleLogout}
            >
                <LogOut className="mr-2" />
                Sair
            </Button>
        </div>
    );
}

function MobileHeader() {
    const { isMobile } = useSidebar();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !isMobile) return null;

    return (
        <header className="header-mobile">
            <SidebarTrigger />
            <div className="logo-mobile">
                <i className="fas fa-paw"></i>
                Pawsome
            </div>
        </header>
    );
}

function AppLayoutContent({ children }: { children: ReactNode }) {
    const { user, loading } = useRequireAuth();

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar>
                <SidebarHeader>
                    <div className="logo">
                        <i className="fas fa-paw"></i>
                        <h1 className="flex-1 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:-ml-2 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">Pawsome</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <MainNav />
                </SidebarContent>
                <SidebarFooter>
                    <div className="hidden md:block">
                        <SidebarToggleButton />
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <MobileHeader />
                <main className="main-content">
                    {children}
                </main>
            </SidebarInset>
        </div>
    );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
