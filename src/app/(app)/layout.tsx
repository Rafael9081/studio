
'use client';

import { type ReactNode } from 'react';
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
import { PanelLeftClose, PanelLeftOpen, PawPrint } from 'lucide-react';
import MainNav from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

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
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <PawPrint className="h-6 w-6" />
            </div>
             <div className="flex-1 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:-ml-2 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                <h1 className="font-headline text-lg font-bold">Gerenciador de Canil</h1>
            </div>
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
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Pode adicionar breadcrumbs ou título da página aqui */}
            </div>
        </header>
        <main className="flex-1 p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
