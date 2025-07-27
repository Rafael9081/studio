'use server';

import { type Dog, type Tutor, type Expense, type Sale } from './types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'lib', 'data');
const dogsFilePath = path.join(dataDir, 'dogs.json');
const tutorsFilePath = path.join(dataDir, 'tutors.json');
const expensesFilePath = path.join(dataDir, 'expenses.json');
const salesFilePath = path.join(dataDir, 'sales.json');


// Helper to read data from JSON file
const readData = <T>(filePath: string, defaultData: T[] = []): T[] => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading from ${filePath}:`, error);
    return defaultData;
  }
};

// Helper to write data to JSON file
const writeData = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
};

// Dogs
export const getDogs = async (): Promise<Dog[]> => readData<Dog>(dogsFilePath, [
  { id: '1', name: 'Buddy', breed: 'Golden Retriever', sex: 'Macho', status: 'Disponível', avatar: 'https://placehold.co/40x40.png', birthDate: new Date('2023-01-15'), observations: 'Muito brincalhão e amigável.' },
  { id: '2', name: 'Lucy', breed: 'Labrador', sex: 'Fêmea', status: 'Disponível', avatar: 'https://placehold.co/40x40.png', birthDate: new Date('2023-03-20'), specialCharacteristics: 'Pelagem cor de chocolate.' },
  { id: '3', name: 'Max', breed: 'Pastor Alemão', sex: 'Macho', status: 'Vendido', tutorId: '1', salePrice: 1200, dateOfSale: new Date('2024-05-15'), avatar: 'https://placehold.co/40x40.png', birthDate: new Date('2022-11-10'), fatherId: '1', motherId: '2' },
  { id: '4', name: 'Daisy', breed: 'Beagle', sex: 'Fêmea', status: 'Disponível', avatar: 'https://placehold.co/40x40.png', birthDate: new Date('2023-08-01') },
  { id: '5', name: 'Charlie', breed: 'Poodle', sex: 'Macho', status: 'Vendido', tutorId: '2', salePrice: 1500, dateOfSale: new Date('2024-06-01'), avatar: 'https://placehold.co/40x40.png', birthDate: new Date('2023-05-25') },
]);
export const getDogById = async (id: string) => {
    const dogs = await getDogs();
    return dogs.find(dog => dog.id === id);
};
export const addDog = async (dog: Omit<Dog, 'id' | 'status' | 'avatar'>) => {
  const dogs = await getDogs();
  const newDog: Dog = { ...dog, id: String(Date.now()), status: 'Disponível', avatar: `https://placehold.co/40x40.png?text=${dog.name.charAt(0)}` };
  const updatedDogs = [...dogs, newDog];
  writeData(dogsFilePath, updatedDogs);
  revalidatePath('/dogs');
  revalidatePath('/dashboard');
  return newDog;
};
export const updateDog = async (updatedDog: Omit<Dog, 'id'> & { id: string }) => {
    const dogs = await getDogs();
    const index = dogs.findIndex(dog => dog.id === updatedDog.id);
    if(index !== -1) {
        dogs[index] = { ...dogs[index], ...updatedDog };
        writeData(dogsFilePath, dogs);
        revalidatePath('/dogs');
        revalidatePath(`/dogs/${updatedDog.id}`);
        revalidatePath(`/dogs/${updatedDog.id}/edit`);
        revalidatePath('/dashboard');
        return dogs[index];
    }
    return null;
}
export const deleteDog = async (id: string) => {
    let dogs = await getDogs();
    let expenses = await getExpenses();
    let sales = await getSales();
    writeData(dogsFilePath, dogs.filter(dog => dog.id !== id));
    writeData(expensesFilePath, expenses.filter(expense => expense.dogId !== id));
    writeData(salesFilePath, sales.filter(sale => sale.dogId !== id));
    revalidatePath('/dogs');
    revalidatePath('/dashboard');
};
export const recordSale = async (sale: Omit<Sale, 'id'>) => {
    const dog = await getDogById(sale.dogId);
    if (dog) {
        dog.status = 'Vendido';
        dog.tutorId = sale.tutorId;
        dog.salePrice = sale.price;
        dog.dateOfSale = sale.date;
        await updateDog(dog);
        const sales = await getSales();
        writeData(salesFilePath, [...sales, sale]);
        revalidatePath('/dashboard');
        revalidatePath('/dogs');
        revalidatePath('/sales');
    }
};


// Tutors
export const getTutors = async (): Promise<Tutor[]> => readData<Tutor>(tutorsFilePath, [
    { id: '1', name: 'João da Silva', phone: '123-456-7890', avatar: 'https://placehold.co/40x40.png' },
    { id: '2', name: 'Maria Souza', phone: '098-765-4321', avatar: 'https://placehold.co/40x40.png' },
    { id: '3', name: 'Pedro Jones', phone: '555-555-5555', avatar: 'https://placehold.co/40x40.png' },
]);
export const getTutorById = async (id: string) => {
    const tutors = await getTutors();
    return tutors.find(tutor => tutor.id === id)
};
export const addTutor = async (tutor: Omit<Tutor, 'id' | 'avatar'>) => {
    const tutors = await getTutors();
    const newTutor: Tutor = { ...tutor, id: String(Date.now()), avatar: 'https://placehold.co/40x40.png' };
    writeData(tutorsFilePath, [...tutors, newTutor]);
    revalidatePath('/tutors');
    revalidatePath('/dashboard');
    return newTutor;
};
export const updateTutor = async (updatedTutor: Tutor) => {
    const tutors = await getTutors();
    const index = tutors.findIndex(tutor => tutor.id === updatedTutor.id);
    if(index !== -1) {
        tutors[index] = updatedTutor;
        writeData(tutorsFilePath, tutors);
        revalidatePath('/tutors');
        revalidatePath(`/tutors/${updatedTutor.id}/edit`);
        return tutors[index];
    }
    return null;
};
export const deleteTutor = async (id: string) => {
    const tutors = await getTutors();
    writeData(tutorsFilePath, tutors.filter(tutor => tutor.id !== id));
    const dogs = await getDogs();
    const updatedDogs = dogs.map(dog => {
        if (dog.tutorId === id) {
            return { ...dog, tutorId: undefined };
        }
        return dog;
    })
    writeData(dogsFilePath, updatedDogs);
    revalidatePath('/tutors');
    revalidatePath('/dogs');
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => readData<Expense>(expensesFilePath, [
    {id: '1', dogId: '1', type: 'Alimentação', amount: 50, date: new Date('2024-06-05'), description: 'Ração premium'},
    {id: '2', dogId: '1', type: 'Vacinas', amount: 120, date: new Date('2024-06-10'), description: 'Vacinas anuais'},
    {id: '3', dogId: '2', type: 'Veterinário', amount: 75, date: new Date('2024-06-12'), description: 'Tratamento de pulgas'},
    {id: '4', dogId: '3', type: 'Geral', amount: 30, date: new Date('2024-05-10'), description: 'Coleira e guia novas'},
    {id: '5', dogId: '1', type: 'Veterinário', amount: 200, date: new Date('2024-07-01'), description: 'Consulta de rotina'},
]);
export const getExpensesByDogId = async (dogId: string) => {
    const expenses = await getExpenses();
    return expenses.filter(e => e.dogId === dogId)
};
export const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const expenses = await getExpenses();
    const newExpense = { ...expense, id: String(Date.now()) };
    writeData(expensesFilePath, [...expenses, newExpense]);
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    return newExpense;
}

// Sales
export const getSales = async (): Promise<Sale[]> => readData<Sale>(salesFilePath, [
    { dogId: '3', tutorId: '1', price: 1200, date: new Date('2024-05-15') },
    { dogId: '5', tutorId: '2', price: 1500, date: new Date('2024-06-01') },
]);
