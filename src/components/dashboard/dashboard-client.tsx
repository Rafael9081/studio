'use client';

import * as React from 'react';
import { Dog, Users, DollarSign, Calendar as CalendarIcon, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import type { Dog as DogType, Tutor, Sale, Expense, GeneralExpense } from '@/lib/types';
import { addDays, format, sub } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DashboardClientProps {
  dogs: DogType[];
  tutors: Tutor[];
  sales: Sale[];
  expenses: (Expense | GeneralExpense)[];
}

export default function DashboardClient({ dogs, tutors, sales, expenses }: DashboardClientProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: sub(new Date(), { days: 29 }),
    to: new Date(),
  })

  const availableDogs = dogs.filter((dog) => dog.status === 'Disponível').length;
  const totalTutors = tutors.length;
  
  const filteredSales = sales.filter(sale => {
    if (!date?.from) return true;
    const saleDate = new Date(sale.date);
    const fromDate = new Date(date.from);
    fromDate.setHours(0,0,0,0);
    
    if (date.to) {
        const toDate = new Date(date.to)
        toDate.setHours(23,59,59,999);
        return saleDate >= fromDate && saleDate <= toDate;
    }
    return saleDate >= fromDate;
  });

  const filteredExpenses = expenses.filter(expense => {
    if (!date?.from) return true;
    const expenseDate = new Date(expense.date);
    const fromDate = new Date(date.from);
    fromDate.setHours(0,0,0,0);
    
    if (date.to) {
        const toDate = new Date(date.to)
        toDate.setHours(23,59,59,999);
        return expenseDate >= fromDate && expenseDate <= toDate;
    }
    return expenseDate >= fromDate;
  });

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.price, 0);
  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const dailyData = [...filteredSales, ...filteredExpenses].reduce((acc, item) => {
    const day = format(new Date(item.date), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = { date: day, revenue: 0, expenses: 0 };
    }
    if ('price' in item) {
      acc[day].revenue += item.price;
    } else {
      acc[day].expenses += item.amount;
    }
    return acc;
  }, {} as Record<string, { date: string, revenue: number, expenses: number }>);

  const chartData = Object.values(dailyData).map(item => ({
    date: format(new Date(item.date), 'd MMM', { locale: ptBR }),
    revenue: item.revenue,
    expenses: item.expenses
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const chartConfig = {
    revenue: {
      label: 'Receita',
      color: 'hsl(var(--chart-1))',
    },
    expenses: {
        label: 'Despesas',
        color: 'hsl(var(--chart-2))',
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Com base no período selecionado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Despesas de cães e despesas gerais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas - Despesas no período
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cães Disponíveis</CardTitle>
            <Dog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDogs}</div>
            <p className="text-xs text-muted-foreground">Total de cães à venda</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-headline">Visão Geral Financeira</CardTitle>
                <p className="text-sm text-muted-foreground">Um resumo de receitas e despesas ao longo do tempo.</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                          {format(date.to, "LLL dd, y", { locale: ptBR })}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y", { locale: ptBR })
                      )
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `R$${value}`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend />
              <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} name="Receita" />
              <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={false} name="Despesas" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
