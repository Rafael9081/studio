'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dog, LayoutDashboard, Users, DollarSign, Wallet, Briefcase, Baby } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/dogs', icon: Dog, label: 'Cães' },
  { href: '/tutors', icon: Users, label: 'Tutores' },
  { href: '/litters', icon: Baby, label: 'Ninhadas' },
  { href: '/sales', icon: DollarSign, label: 'Vendas' },
  { href: '/expenses', icon: Wallet, label: 'Despesas Cães' },
  { href: '/general-expenses', icon: Briefcase, label: 'Despesas Gerais' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
