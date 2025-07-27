'use server';

import { type Dog, type Tutor, type Expense, type Sale, type GeneralExpense } from './types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'lib', 'data');
const dogsFilePath = path.join(dataDir, 'dogs.json');
const tutorsFilePath = path.join(dataDir, 'tutors.json');
const expensesFilePath = path.join(dataDir, 'expenses.json');
const generalExpensesFilePath = path.join(dataDir, 'generalExpenses.json');
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
    // For dates, we need to convert them back to Date objects
    return JSON.parse(data, (key, value) => {
      if (key.endsWith('Date') || key === 'date' || key === 'dateOfSale' || key === 'birthDate') {
        if (value) return new Date(value);
      }
      return value;
    });
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
export const getDogs = async (): Promise<Dog[]> => readData<Dog>(dogsFilePath, []);
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
        const updatedDog: Dog = {
            ...dog,
            status: 'Vendido',
            tutorId: sale.tutorId,
            salePrice: sale.price,
            dateOfSale: sale.date,
        }
        await updateDog(updatedDog);
        const sales = await getSales();
        writeData(salesFilePath, [...sales, sale]);
        revalidatePath('/dashboard');
        revalidatePath('/dogs');
        revalidatePath('/sales');
    }
};


// Tutors
export const getTutors = async (): Promise<Tutor[]> => readData<Tutor>(tutorsFilePath, []);
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
export const getExpenses = async (): Promise<Expense[]> => readData<Expense>(expensesFilePath, []);
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
    revalidatePath(`/dogs/${expense.dogId}`);
    return newExpense;
}

// General Expenses
export const getGeneralExpenses = async (): Promise<GeneralExpense[]> => readData<GeneralExpense>(generalExpensesFilePath, []);
export const addGeneralExpense = async (expense: Omit<GeneralExpense, 'id'>) => {
    const expenses = await getGeneralExpenses();
    const newExpense = { ...expense, id: String(Date.now()) };
    writeData(generalExpensesFilePath, [...expenses, newExpense]);
    revalidatePath('/dashboard');
    revalidatePath('/general-expenses');
    return newExpense;
}


// Sales
export const getSales = async (): Promise<Sale[]> => readData<Sale>(salesFilePath, []);
