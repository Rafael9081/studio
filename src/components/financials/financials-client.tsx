'use client';

import * as React from 'react';
import { Dog, DollarSign, Calendar as CalendarIcon, Wallet, TrendingUp, ArrowDown, ArrowUp, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line as RechartsLine } from 'recharts';
import type { Dog as DogType, Tutor, Sale, Expense, GeneralExpense } from '@/lib/types';
import { format, subDays, startOfDay } from "date-fns"
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

interface FinancialsClientProps {
  dogs: DogType[];
  tutors: Tutor[];
  sales: Sale[];
  expenses: (Expense | GeneralExpense)[];
}

export default function FinancialsClient({ dogs, sales, expenses }: FinancialsClientProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })

  const availableDogs = dogs.filter((dog) => dog.status === 'Disponível').length;
  
  const filteredSales = sales.filter(sale => {
    if (!date?.from) return true;
    const saleDate = new Date(sale.date);
    const fromDate = startOfDay(date.from);
    
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
    const fromDate = startOfDay(date.from);
    
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
      acc[day] = { date: day, Receita: 0, Despesas: 0 };
    }
    if ('price' in item) {
      acc[day].Receita += item.price;
    } else {
      acc[day].Despesas += item.amount;
    }
    return acc;
  }, {} as Record<string, { date: string, Receita: number, Despesas: number }>);

  const chartData = Object.values(dailyData).map(item => ({
    date: format(new Date(item.date), 'd MMM', { locale: ptBR }),
    Receita: item.Receita,
    Despesas: item.Despesas
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const chartConfig = {
    Receita: {
      label: 'Receita',
      color: 'hsl(var(--chart-1))',
    },
    Despesas: {
        label: 'Despesas',
        color: 'hsl(var(--chart-2))',
    }
  };

  return (
    <>
      <div className="financial-stats">
          <div className="financial-card revenue">
              <div className="card-header">
                  <div className="card-title">Receita Total</div>
                  <div className="card-icon revenue"><ArrowUp className="h-5 w-5" /></div>
              </div>
              <div className="card-value">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-subtitle">Com base no período selecionado</div>
          </div>
          <div className="financial-card expense">
              <div className="card-header">
                  <div className="card-title">Despesas Totais</div>
                  <div className="card-icon expense"><ArrowDown className="h-5 w-5" /></div>
              </div>
              <div className="card-value">{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-subtitle">Despesas de cães e despesas gerais</div>
          </div>
          <div className="financial-card profit">
              <div className="card-header">
                  <div className="card-title">Lucro Líquido</div>
                  <div className="card-icon profit"><BarChart className="h-5 w-5" /></div>
              </div>
              <div className="card-value profit-value">{netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div className="card-subtitle">Receitas - Despesas no período</div>
          </div>
          <div className="financial-card dogs">
              <div className="card-header">
                  <div className="card-title">Cães Disponíveis</div>
                  <div className="card-icon dogs"><Dog className="h-5 w-5" /></div>
              </div>
              <div className="card-value">{availableDogs}</div>
              <div className="card-subtitle">Total de cães à venda</div>
          </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
              <div>
                <h3 className="chart-title">Visão Geral Financeira</h3>
                <p className="chart-subtitle">Um resumo de receitas e despesas ao longo do tempo.</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[300px] justify-start text-left font-normal date-range",
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
        <div className="chart-container">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `R$${(value / 1000)}k`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={(value, name) => `${name}: ${Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} />}
              />
              <RechartsLine dataKey="Receita" type="monotone" stroke="var(--color-Receita)" strokeWidth={3} dot={{r: 6}} fill="rgba(66, 153, 225, 0.1)" name="Receita" />
              <RechartsLine dataKey="Despesas" type="monotone" stroke="var(--color-Despesas)" strokeWidth={3} dot={{r: 6}} fill="rgba(245, 101, 101, 0.1)" name="Despesas" />
            </LineChart>
          </ChartContainer>
        </div>
          <div className="chart-legend">
              <div className="legend-item">
                  <div className="legend-color revenue"></div>
                  <span>Receitas</span>
              </div>
              <div className="legend-item">
                  <div className="legend-color expense"></div>
                  <span>Despesas</span>
              </div>
          </div>
      </div>
    </>
  );
}
