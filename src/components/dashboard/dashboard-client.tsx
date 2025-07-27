'use client';

import * as React from 'react';
import { Dog, Users, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { Dog, Tutor, Sale } from '@/lib/types';
import { addDays, format } from "date-fns"
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
  dogs: Dog[];
  tutors: Tutor[];
  sales: Sale[];
}

export default function DashboardClient({ dogs, tutors, sales }: DashboardClientProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  })

  const availableDogs = dogs.filter((dog) => dog.status === 'Available').length;
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

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.price, 0);

  const salesByDay = filteredSales.reduce((acc, sale) => {
    const day = format(new Date(sale.date), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += sale.price;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByDay).map(([date, revenue]) => ({
    date: format(new Date(date), 'MMM d'),
    revenue
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--accent))',
    },
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Dogs</CardTitle>
            <Dog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDogs}</div>
            <p className="text-xs text-muted-foreground">Ready for a new home</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTutors}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on selected date range
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-headline">Financial Summary</CardTitle>
                <p className="text-sm text-muted-foreground">A summary of sales over time.</p>
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
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
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
                  />
                </PopoverContent>
              </Popover>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
