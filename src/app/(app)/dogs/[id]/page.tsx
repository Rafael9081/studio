import { getDogById, getDogs, getExpensesByDogId, getTutorById, getDogEvents } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, GitBranch, BarChart2, CalendarDays, HeartPulse } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddEventDialog from "@/components/dogs/add-event-dialog";
import EventsHistory from "@/components/dogs/events-history";
import { Dog } from "@/lib/types";

function calculateAge(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    const yearsText = age > 1 ? "anos" : "ano";
    const months = m < 0 ? 12 + m : m;
    const monthsText = months > 1 ? "meses" : "mês";

    if (age > 0) {
        return `${age} ${yearsText}`;
    } else {
        return `${months} ${monthsText}`;
    }
}

export default async function DogDetailsPage({ params }: { params: { id: string } }) {
  const dog = await getDogById(params.id);

  if (!dog) {
    notFound();
  }

  const [expenses, allDogs, events, tutor] = await Promise.all([
    getExpensesByDogId(dog.id),
    getDogs(),
    getDogEvents(dog.id),
    dog.tutorId ? getTutorById(dog.tutorId) : Promise.resolve(null),
  ]);

  const father = dog.fatherId ? allDogs.find(d => d.id === dog.fatherId) : null;
  const mother = dog.motherId ? allDogs.find(d => d.id === dog.motherId) : null;
  const maleDogs = allDogs.filter(d => d.sex === 'Macho' && d.id !== dog.id);

  const getBadgeVariant = () => {
    switch (dog.status) {
        case 'Disponível':
            return 'secondary';
        case 'Gestante':
            return 'default';
        case 'Vendido':
            return 'destructive';
        default:
            return 'default';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
            <Link href="/dogs">
                <ArrowLeft className="mr-2" />
                Voltar
            </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline text-center">{dog.name}</h1>
        <div className="flex gap-2">
            <AddEventDialog dog={dog} maleDogs={maleDogs} />
            <Button asChild variant="outline">
                <Link href={`/dogs/${dog.id}/health`}>
                    <HeartPulse className="mr-2" />
                    Saúde
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href={`/dogs/${dog.id}/ancestry`}>
                    <GitBranch className="mr-2" />
                    Genealogia
                </Link>
            </Button>
            <Button asChild>
                <Link href={`/dogs/${dog.id}/edit`}>
                    <Edit className="mr-2" />
                    Editar
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
             <Card>
                <CardContent className="pt-6 flex flex-col items-center gap-4">
                     <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={dog.avatar} data-ai-hint="dog" alt={dog.name} />
                        <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{dog.name}</h2>
                        <p className="text-muted-foreground">{dog.breed}</p>
                    </div>
                     <Badge variant={getBadgeVariant()} className="text-sm">
                        {dog.status}
                    </Badge>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Detalhes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="font-semibold">Sexo:</span>
                        <span>{dog.sex}</span>
                    </div>
                     {dog.birthDate && (
                        <>
                            <div className="flex justify-between">
                                <span className="font-semibold">Nascimento:</span>
                                <span>{format(dog.birthDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Idade:</span>
                                <span>{calculateAge(dog.birthDate)}</span>
                            </div>
                        </>
                    )}
                    {father && (
                         <div className="flex justify-between">
                            <span className="font-semibold">Pai:</span>
                            <Link href={`/dogs/${father.id}`} className="text-primary hover:underline">{father.name}</Link>
                        </div>
                    )}
                    {mother && (
                         <div className="flex justify-between">
                            <span className="font-semibold">Mãe:</span>
                            <Link href={`/dogs/${mother.id}`} className="text-primary hover:underline">{mother.name}</Link>
                        </div>
                    )}
                    {dog.specialCharacteristics && (
                        <div className="flex flex-col">
                            <span className="font-semibold">Características Especiais:</span>
                            <p className="text-muted-foreground">{dog.specialCharacteristics}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {dog.sex === 'Fêmea' && dog.status === 'Gestante' && dog.matingDate && (
                 <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="text-primary" />
                            Acompanhamento da Gestação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Data da Monta:</span>
                            <span>{format(new Date(dog.matingDate), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                            <span className="font-semibold text-muted-foreground">Previsão de Parto</span>
                             <span className="text-lg font-bold text-primary">
                                {format(addDays(new Date(dog.matingDate), 58), 'dd/MM/yy')} - {format(addDays(new Date(dog.matingDate), 65), 'dd/MM/yy')}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

             {dog.status === 'Vendido' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Venda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tutor && (
                             <div className="flex justify-between">
                                <span className="font-semibold">Tutor:</span>
                                <span>{tutor.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="font-semibold">Preço da Venda:</span>
                            <span>{dog.salePrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="font-semibold">Data da Venda:</span>
                            <span>{dog.dateOfSale ? format(new Date(dog.dateOfSale), 'dd/MM/yyyy') : 'N/A'}</span>
                        </div>
                         <Button asChild className="w-full">
                            <Link href={`/dogs/${dog.id}/financials`}>
                                <BarChart2 className="mr-2" />
                                Ver Relatório Financeiro
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
             <Card>
                <CardHeader>
                    <CardTitle>Histórico de Eventos</CardTitle>
                    <CardDescription>Eventos de saúde e reprodutivos de {dog.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                     <EventsHistory events={events} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Observações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {dog.observations || "Nenhuma observação registrada."}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Despesas</CardTitle>
                    <CardDescription>Todas as despesas registradas para {dog.name}.</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}