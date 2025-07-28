'use server';
/**
 * @fileOverview A flow to retrieve all available dogs for external automation.
 *
 * - getAvailableDogs - A function that returns a list of available dogs.
 * - AvailableDogSchema - The simplified output schema for a dog.
 */

import { ai } from '@/ai/genkit';
import { getDogs } from '@/lib/data';
import { Dog } from '@/lib/types';
import { z } from 'zod';

// Define a simpler schema for the output, suitable for an external API.
export const AvailableDogSchema = z.object({
  id: z.string().describe('The unique identifier for the dog.'),
  name: z.string().describe('The name of the dog.'),
  breed: z.string().describe('The breed of the dog.'),
  sex: z.enum(['Macho', 'Fêmea']).describe('The sex of the dog.'),
  avatar: z.string().optional().describe('The URL of the dog\'s avatar image.'),
  birthDate: z.string().optional().describe('The birth date of the dog in ISO format.'),
  specialCharacteristics: z.string().optional().describe('Any special characteristics of the dog.'),
});

export const GetAvailableDogsOutputSchema = z.array(AvailableDogSchema);
export type GetAvailableDogsOutput = z.infer<typeof GetAvailableDogsOutputSchema>;

// This is the main exported function that can be called from other parts of the app.
export async function getAvailableDogs(): Promise<GetAvailableDogsOutput> {
  return getAvailableDogsFlow();
}

// Define the Genkit flow.
const getAvailableDogsFlow = ai.defineFlow(
  {
    name: 'getAvailableDogs',
    // No input schema is needed as it takes no arguments.
    inputSchema: z.void(),
    outputSchema: GetAvailableDogsOutputSchema,
  },
  async () => {
    // Fetch all dogs from the database.
    const allDogs = await getDogs();

    // Filter for dogs with the status "Disponível" (Available).
    const availableDogs = allDogs.filter((dog: Dog) => dog.status === 'Disponível');

    // Map the full dog data to the simplified output schema.
    const formattedDogs = availableDogs.map(dog => ({
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      sex: dog.sex,
      avatar: dog.avatar,
      birthDate: dog.birthDate?.toISOString(),
      specialCharacteristics: dog.specialCharacteristics,
    }));

    return formattedDogs;
  }
);
