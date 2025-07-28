import { getDogById, getDogEvents } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Syringe, Bug, Stethoscope, HeartPulse, LineChart } from "lucide-react";
import { DogEvent } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import WeightChart from "@/components/dogs/weight-chart";

const healthEventTypes: DogEvent['type'][] = ['Vacina', 'Vermifugação', 'Consulta Veterinária', 'Doença/Tratamento', 'Pesagem'];

const eventIcons: Record<DogEvent['type'], React.ReactNode> = {
  'Vacina': <Syringe className="h-5 w-5 text-blue-500" />,
  'Vermifugação': <Bug className="h-5 w-5 text-purple-500" />,
  'Consulta Veterinária': <Stethoscope className="h-5 w-5 text-teal-500" />,
  'Doença/Tratamento': <HeartPulse className="h-5 w-5 text-red-500" />,
  'Pesagem': <LineChart className="h-5 w-5 text-gray-500" />,
   // Irrelevant for this page, but needed for type safety
  'Cio': <></>,
  'Monta': <></>,
  'Parto': <></>,
};

export default async function HealthPage({ params }: { params: { id: string } }) {
  const dog = await getDogById(params.id);

  if (!dog) {
    notFound();
  }

  const allEvents = await getDogEvents(dog.id);
  const healthEvents = allEvents.filter(event => healthEventTypes.includes(event.type));
  const weightData = allEvents
    .filter(event => event.weight && event.weight > 0)
    .map(event => ({
      date: format(event.date, 'dd/MM/yy'),
      weight: event.weight,
    }))
    .reverse(); // Reverse to have chronological order for the chart

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
             <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><HeartPulse /> Histórico de Saúde</h1>
             <p className="text-muted-foreground">Acompanhamento de saúde para {dog.name}</p>
        </div>
        <div className="w-[170px]" /> 
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Eventos de Saúde</CardTitle>
                    <CardDescription>Vacinas, vermifugações, consultas e outros eventos de saúde.</CardDescription>
                </CardHeader>
                <CardContent>
                    {healthEvents.length > 0 ? (
                         <div className="space-y-6">
                            {healthEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                    {eventIcons[event.type]}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{event.type}</p>
                                    <p className="text-sm text-muted-foreground">{event.notes || 'Nenhuma observação.'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                    {format(event.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                </div>
                                {event.weight && (
                                    <div className="text-sm font-medium text-right">
                                        {event.weight} kg
                                    </div>
                                )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
                            Nenhum evento de saúde registrado. Adicione um evento na página de detalhes do cão.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Gráfico de Crescimento</CardTitle>
                    <CardDescription>Evolução do peso de {dog.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                     {weightData.length > 1 ? (
                        <WeightChart data={weightData} />
                     ) : (
                         <div className="flex h-[250px] items-center justify-center text-center text-sm text-muted-foreground">
                            Registre pelo menos dois pesos para visualizar o gráfico de crescimento.
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
