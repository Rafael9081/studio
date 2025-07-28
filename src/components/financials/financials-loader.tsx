'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/(app)/loading';
import { Dog, Expense, GeneralExpense, Sale, Tutor } from '@/lib/types';

const FinancialsClient = dynamic(() => import('@/components/financials/financials-client'), {
  ssr: false,
  loading: () => <div className="h-[70vh]"><Loading /></div>
});

interface FinancialsLoaderProps {
  dogs: Dog[];
  tutors: Tutor[];
  sales: Sale[];
  expenses: (Expense | GeneralExpense)[];
}

export default function FinancialsLoader(props: FinancialsLoaderProps) {
  return <FinancialsClient {...props} />
}
