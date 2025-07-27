'use server';

// This is a mock database. In a real application, you would use a real database.
import { type Dog, type Tutor, type Expense, type Sale } from './types';
import { revalidatePath } from 'next/cache';

let dogs: Dog[] = [
  { id: '1', name: 'Buddy', breed: 'Golden Retriever', sex: 'Macho', status: 'Disponível', avatar: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Lucy', breed: 'Labrador', sex: 'Fêmea', status: 'Disponível', avatar: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Max', breed: 'Pastor Alemão', sex: 'Macho', status: 'Vendido', tutorId: '1', salePrice: 1200, dateOfSale: new Date('2024-05-15'), avatar: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Daisy', breed: 'Beagle', sex: 'Fêmea', status: 'Disponível', avatar: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Charlie', breed: 'Poodle', sex: 'Macho', status: 'Vendido', tutorId: '2', salePrice: 1500, dateOfSale: new Date('2024-06-01'), avatar: 'https://placehold.co/40x40.png' },
];

let tutors: Tutor[] = [
    { id: '1', name: 'João da Silva', phone: '123-456-7890', avatar: 'https://placehold.co/40x40.png' },
    { id: '2', name: 'Maria Souza', phone: '098-765-4321', avatar: 'https://placehold.co/40x40.png' },
    { id: '3', name: 'Pedro Jones', phone: '555-555-5555', avatar: 'https://placehold.co/40x40.png' },
];

let expenses: Expense[] = [
    {id: '1', dogId: '1', type: 'Alimentação', amount: 50, date: new Date('2024-06-05'), description: 'Ração premium'},
    {id: '2', dogId: '1', type: 'Vacinas', amount: 120, date: new Date('2024-06-10'), description: 'Vacinas anuais'},
    {id: '3', dogId: '2', type: 'Veterinário', amount: 75, date: new Date('2024-06-12'), description: 'Tratamento de pulgas'},
    {id: '4', dogId: '3', type: 'Geral', amount: 30, date: new Date('2024-05-10'), description: 'Coleira e guia novas'},
];

let sales: Sale[] = [
    { dogId: '3', tutorId: '1', price: 1200, date: new Date('2024-05-15') },
    { dogId: '5', tutorId: '2', price: 1500, date: new Date('2024-06-01') },
];

// Dogs
export const getDogs = async () => dogs;
export const getDogById = async (id: string) => dogs.find(dog => dog.id === id);
export const addDog = async (dog: Omit<Dog, 'id' | 'status'>) => {
  const newDog: Dog = { ...dog, id: String(Date.now()), status: 'Disponível', avatar: 'https://placehold.co/40x40.png' };
  dogs.push(newDog);
  revalidatePath('/dogs');
  revalidatePath('/dashboard');
  return newDog;
};
export const updateDog = async (updatedDog: Dog) => {
    const index = dogs.findIndex(dog => dog.id === updatedDog.id);
    if(index !== -1) {
        dogs[index] = updatedDog;
        revalidatePath('/dogs');
        revalidatePath(`/dogs/${updatedDog.id}/edit`);
        revalidatePath('/dashboard');
        return dogs[index];
    }
    return null;
}
export const deleteDog = async (id: string) => {
    dogs = dogs.filter(dog => dog.id !== id);
    expenses = expenses.filter(expense => expense.dogId !== id);
    sales = sales.filter(sale => sale.dogId !== id);
    revalidatePath('/dogs');
    revalidatePath('/dashboard');
};
export const recordSale = async (sale: Sale) => {
    const dog = await getDogById(sale.dogId);
    if (dog) {
        dog.status = 'Vendido';
        dog.tutorId = sale.tutorId;
        dog.salePrice = sale.price;
        dog.dateOfSale = sale.date;
        await updateDog(dog);
        sales.push(sale);
        revalidatePath('/dashboard');
        revalidatePath('/dogs');
        revalidatePath(`/dogs/${sale.dogId}/edit`);
    }
};


// Tutors
export const getTutors = async () => tutors;
export const getTutorById = async (id: string) => tutors.find(tutor => tutor.id === id);
export const addTutor = async (tutor: Omit<Tutor, 'id'>) => {
    const newTutor: Tutor = { ...tutor, id: String(Date.now()), avatar: 'https://placehold.co/40x40.png' };
    tutors.push(newTutor);
    revalidatePath('/tutors');
    revalidatePath('/dashboard');
    return newTutor;
};
export const updateTutor = async (updatedTutor: Tutor) => {
    const index = tutors.findIndex(tutor => tutor.id === updatedTutor.id);
    if(index !== -1) {
        tutors[index] = updatedTutor;
        revalidatePath('/tutors');
        revalidatePath(`/tutors/${updatedTutor.id}/edit`);
        return tutors[index];
    }
    return null;
};
export const deleteTutor = async (id: string) => {
    tutors = tutors.filter(tutor => tutor.id !== id);
    // Optional: handle what happens to dogs associated with a deleted tutor
    dogs.forEach(dog => {
        if (dog.tutorId === id) {
            dog.tutorId = undefined;
            // Decide if the dog should become available again or be marked differently
        }
    });
    revalidatePath('/tutors');
    revalidatePath('/dogs');
};

// Expenses
export const getExpensesByDogId = async (dogId: string) => expenses.filter(e => e.dogId === dogId);
export const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: String(Date.now()) };
    expenses.push(newExpense);
    revalidatePath(`/dogs/${expense.dogId}/edit`);
    return newExpense;
}

// Sales
export const getSales = async () => sales;