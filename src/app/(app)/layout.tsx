import { type ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Dog, Home, Users, Settings } from 'lucide-react';
import MainNav from '@/components/main-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="paw logo" alt="Pawsome Logo" />
            </Avatar>
            <h1 className="font-headline text-lg font-bold">Pawsome</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Configurações">
                <Link href="#">
                  <Settings />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Pode adicionar breadcrumbs ou título da página aqui */}
            </div>
            <Avatar>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </header>
        <main className="flex-1 p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
