'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dog } from '@/lib/types';
import { Button } from '../ui/button';
import { AlertCircle, Heart, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface RelationshipFinderProps {
  currentDog: Dog;
  allDogs: Dog[];
}

type Relationship = 
  | 'Irmãos' 
  | 'Meios-irmãos' 
  | 'Pais e Filhos' 
  | 'Avós e Netos' 
  | 'Tios e Sobrinhos'
  | 'Primos' 
  | 'Sem parentesco direto'
  | 'Mesmo cão'
  | null;

export default function RelationshipFinder({ currentDog, allDogs }: RelationshipFinderProps) {
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<Relationship>(null);

  const otherDogs = useMemo(() => allDogs.filter(d => d.id !== currentDog.id), [allDogs, currentDog.id]);

  const getAncestors = (dogId: string, maxDepth = 4): Set<string> => {
    const ancestors = new Set<string>();
    const queue: [string, number][] = [[dogId, 0]];
    
    while(queue.length > 0) {
      const [currentId, depth] = queue.shift()!;
      if (depth >= maxDepth) continue;

      const dog = allDogs.find(d => d.id === currentId);
      if (dog) {
        if (dog.fatherId) {
          ancestors.add(dog.fatherId);
          queue.push([dog.fatherId, depth + 1]);
        }
        if (dog.motherId) {
          ancestors.add(dog.motherId);
          queue.push([dog.motherId, depth + 1]);
        }
      }
    }
    return ancestors;
  };

  const getParents = (dogId: string) => {
    const dog = allDogs.find(d => d.id === dogId);
    return new Set([dog?.fatherId, dog?.motherId].filter(Boolean) as string[]);
  };
  
  const getGrandparents = (dogId: string) => {
    const parents = getParents(dogId);
    const grandparents = new Set<string>();
    parents.forEach(parentId => {
      getParents(parentId).forEach(gpId => grandparents.add(gpId));
    });
    return grandparents;
  };

  const checkRelationship = () => {
    if (!selectedDogId) {
        setRelationship(null);
        return;
    }

    if(currentDog.id === selectedDogId) {
        setRelationship('Mesmo cão');
        return;
    }

    const dog1 = currentDog;
    const dog2 = allDogs.find(d => d.id === selectedDogId)!;

    // Pais e Filhos
    if (dog1.fatherId === dog2.id || dog1.motherId === dog2.id || dog2.fatherId === dog1.id || dog2.motherId === dog1.id) {
        setRelationship('Pais e Filhos');
        return;
    }

    const parents1 = getParents(dog1.id);
    const parents2 = getParents(dog2.id);

    // Irmãos
    if (parents1.size > 0 && parents1.size === parents2.size && [...parents1].every(p => parents2.has(p))) {
        setRelationship('Irmãos');
        return;
    }

    // Meios-irmãos
    const commonParents = [...parents1].filter(p => parents2.has(p));
    if (commonParents.length > 0) {
        setRelationship('Meios-irmãos');
        return;
    }
    
    const grandparents1 = getGrandparents(dog1.id);
    const grandparents2 = getGrandparents(dog2.id);

    // Avós e Netos
    if (grandparents1.has(dog2.id) || grandparents2.has(dog1.id)) {
        setRelationship('Avós e Netos');
        return;
    }

    // Tios e sobrinhos
    const commonGrandparentsAsParents = [...grandparents1].filter(gp => parents2.has(gp));
    if (commonGrandparentsAsParents.length > 0) {
        setRelationship('Tios e Sobrinhos');
        return;
    }
     const commonGrandparentsAsParents2 = [...grandparents2].filter(gp => parents1.has(gp));
    if (commonGrandparentsAsParents2.length > 0) {
        setRelationship('Tios e Sobrinhos');
        return;
    }

    // Primos
    const commonGrandparents = [...grandparents1].filter(gp => grandparents2.has(gp));
    if (commonGrandparents.length > 0) {
        setRelationship('Primos');
        return;
    }

    setRelationship('Sem parentesco direto');
  };
  
  const getRelationshipInfo = () => {
    switch(relationship) {
        case 'Irmãos':
        case 'Pais e Filhos':
        case 'Avós e Netos':
        case 'Meios-irmãos':
            return {
                variant: 'destructive',
                icon: <AlertCircle className="h-4 w-4" />,
                title: 'Parentesco Direto de Alto Risco',
                description: `O cruzamento entre ${relationship.toLowerCase()} é extremamente perigoso e não é recomendado devido ao alto risco de problemas genéticos.`,
            }
        case 'Tios e Sobrinhos':
        case 'Primos':
             return {
                variant: 'default',
                icon: <AlertCircle className="h-4 w-4" />,
                title: 'Parentesco de Risco Moderado',
                description: `O cruzamento entre ${relationship.toLowerCase()} pode ser arriscado. Recomenda-se uma análise genética detalhada para evitar problemas de saúde.`,
            }
        case 'Sem parentesco direto':
            return {
                variant: 'default',
                className: 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 [&>svg]:text-green-600',
                icon: <Heart className="h-4 w-4" />,
                title: 'Seguro para Cruzamento',
                description: 'Nenhum parentesco direto encontrado nos registros. O cruzamento é considerado seguro.',
            }
        case 'Mesmo cão':
             return {
                variant: 'destructive',
                icon: <AlertCircle className="h-4 w-4" />,
                title: 'Seleção Inválida',
                description: 'Você não pode comparar um cão com ele mesmo.',
            }
        default:
            return null;
    }
  }

  const info = getRelationshipInfo();


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Users />
            Verificar Parentesco
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Selecione outro cão para verificar o grau de parentesco com <strong>{currentDog.name}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select onValueChange={setSelectedDogId} value={selectedDogId ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cão..." />
            </SelectTrigger>
            <SelectContent>
              {otherDogs.map(dog => (
                <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={checkRelationship} disabled={!selectedDogId} className="w-full sm:w-auto">Verificar</Button>
        </div>
        
        {info && (
          <Alert variant={info.variant} className={info.className}>
            {info.icon}
            <AlertTitle>{info.title}</AlertTitle>
            <AlertDescription>
                {info.description}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
