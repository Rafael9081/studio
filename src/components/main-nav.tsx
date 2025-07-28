'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
  { href: '/financials', icon: 'fa-dollar-sign', label: 'Finanças' },
  { href: '/dogs', icon: 'fa-dog', label: 'Cães' },
  { href: '/tutors', icon: 'fa-users', label: 'Tutores' },
  { href: '/litters', icon: 'fa-baby', label: 'Ninhadas' },
  { href: '/sales', icon: 'fa-shopping-cart', label: 'Vendas' },
  { href: '/expenses', icon: 'fa-receipt', label: 'Despesas Cães' },
  { href: '/general-expenses', icon: 'fa-file-invoice', label: 'Despesas Gerais' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-menu">
      {navItems.map((item) => (
        <div key={item.href} className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}>
          <Link href={item.href}>
              <i className={`fas ${item.icon}`}></i>
              <span className="flex-1 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:-ml-2 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">{item.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  );
}
