import { getDogById, getExpensesByDogId } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default async function FinancialsPage({ params }: { params: { id: string } }) {
  const dog = await getDogById(params.id);

  if (!dog || dog.status !== 'Vendido') {
    notFound();
  }

  const expenses = await getExpensesByDogId(dog.id);

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const salePrice = dog.salePrice || 0;
  const roi = salePrice - totalExpenses;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={`/dogs/${dog.id}`}>
            <ArrowLeft className="mr-2" />
            Voltar para Detalhes
          </Link>
        </Button>
        <div className="text-center">
             <h1 className="text-3xl font-bold font-headline">Relatório Financeiro</h1>
             <p className="text-muted-foreground">Análise de ROI para {dog.name}</p>
        </div>
        <div className="w-[170px]" /> 
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Resumo do Investimento</CardTitle>
            <CardDescription>Análise de custos e receita para {dog.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                    <DollarSign className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Preço da Venda</p>
                    <p className="text-2xl font-bold">{salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <Wallet className="mx-auto h-8 w-8 text-red-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Total de Despesas</p>
                    <p className="text-2xl font-bold">{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                 <div className={`p-4 rounded-lg ${roi >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <TrendingUp className={`mx-auto h-8 w-8 mb-2 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <p className={`text-sm ${roi >= 0 ? 'text-green-700' : 'text-red-700'}`}>Lucro / Prejuízo (ROI)</p>
                    <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-800' : 'text-red-800'}`}>{roi.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>

            <Separator />
            
            <div>
                 <h4 className="text-lg font-semibold mb-2">Histórico de Despesas</h4>
                 <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length > 0 ? (
                                expenses.map(expense => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{format(new Date(expense.date), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{expense.type}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell className="text-right">{expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        Nenhuma despesa registrada para este cão.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}