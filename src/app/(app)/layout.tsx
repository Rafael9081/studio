
'use client';

import { type ReactNode, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import MainNav from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Loading from './loading';


function SidebarToggleButton() {
    const { state, toggleSidebar } = useSidebar();

    if (state === 'collapsed') {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="w-full justify-center"
                onClick={toggleSidebar}
            >
                <PanelLeftOpen />
                <span className="sr-only">Expand sidebar</span>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="w-full justify-center"
            onClick={toggleSidebar}
        >
            <PanelLeftClose />
            <span className="sr-only">Collapse sidebar</span>
        </Button>
    );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <SidebarProvider>
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
                <main className="main-content">
                    {children}
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
