// This is a mock database. In a real application, you would use a real database.
import { type Dog, type Tutor, type Expense, type Sale } from './types';
import { revalidatePath } from 'next/cache';

let dogs: Dog[] = [
  { id: '1', name: 'Buddy', breed: 'Golden Retriever', sex: 'Male', status: 'Available', avatar: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Lucy', breed: 'Labrador', sex: 'Female', status: 'Available', avatar: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Max', breed: 'German Shepherd', sex: 'Male', status: 'Sold', tutorId: '1', salePrice: 1200, dateOfSale: new Date('2024-05-15'), avatar: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Daisy', breed: 'Beagle', sex: 'Female', status: 'Available', avatar: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Charlie', breed: 'Poodle', sex: 'Male', status: 'Sold', tutorId: '2', salePrice: 1500, dateOfSale: new Date('2024-06-01'), avatar: 'https://placehold.co/40x40.png' },
];

let tutors: Tutor[] = [
    { id: '1', name: 'John Doe', phone: '123-456-7890', avatar: 'https://placehold.co/40x40.png' },
    { id: '2', name: 'Jane Smith', phone: '098-765-4321', avatar: 'https://placehold.co/40x40.png' },
    { id: '3', name: 'Peter Jones', phone: '555-555-5555', avatar: 'https://placehold.co/40x40.png' },
];

let expenses: Expense[] = [
    {id: '1', dogId: '1', type: 'Food', amount: 50, date: new Date('2024-06-05'), description: 'Premium dog food'},
    {id: '2', dogId: '1', type: 'Vaccines', amount: 120, date: new Date('2024-06-10'), description: 'Annual shots'},
    {id: '3', dogId: '2', type: 'Medical', amount: 75, date: new Date('2024-06-12'), description: 'Flea treatment'},
    {id: '4', dogId: '3', type: 'General', amount: 30, date: new Date('2024-05-10'), description: 'New leash and collar'},
];

let sales: Sale[] = [
    { dogId: '3', tutorId: '1', price: 1200, date: new Date('2024-05-15') },
    { dogId: '5', tutorId: '2', price: 1500, date: new Date('2024-06-01') },
];

// Dogs
export const getDogs = () => dogs;
export const getDogById = (id: string) => dogs.find(dog => dog.id === id);
export const addDog = (dog: Omit<Dog, 'id' | 'status'>) => {
  const newDog: Dog = { ...dog, id: String(Date.now()), status: 'Available', avatar: 'https://placehold.co/40x40.png' };
  dogs.push(newDog);
  revalidatePath('/dogs');
  revalidatePath('/dashboard');
  return newDog;
};
export const updateDog = (updatedDog: Dog) => {
    const index = dogs.findIndex(dog => dog.id === updatedDog.id);
    if(index !== -1) {
        dogs[index] = updatedDog;
        revalidatePath('/dogs');
        revalidatePath(`/dogs/${updatedDog.id}`);
        revalidatePath('/dashboard');
        return dogs[index];
    }
    return null;
}
export const deleteDog = (id: string) => {
    dogs = dogs.filter(dog => dog.id !== id);
    expenses = expenses.filter(expense => expense.dogId !== id);
    sales = sales.filter(sale => sale.dogId !== id);
    revalidatePath('/dogs');
    revalidatePath('/dashboard');
};
export const recordSale = (sale: Sale) => {
    const dog = getDogById(sale.dogId);
    if (dog) {
        dog.status = 'Sold';
        dog.tutorId = sale.tutorId;
        dog.salePrice = sale.price;
        dog.dateOfSale = sale.date;
        updateDog(dog);
        sales.push(sale);
        revalidatePath('/dashboard');
        revalidatePath('/dogs');
        revalidatePath(`/dogs/${sale.dogId}`);
    }
};


// Tutors
export const getTutors = () => tutors;
export const getTutorById = (id: string) => tutors.find(tutor => tutor.id === id);
export const addTutor = (tutor: Omit<Tutor, 'id'>) => {
    const newTutor: Tutor = { ...tutor, id: String(Date.now()), avatar: 'https://placehold.co/40x40.png' };
    tutors.push(newTutor);
    revalidatePath('/tutors');
    revalidatePath('/dashboard');
    return newTutor;
};
export const updateTutor = (updatedTutor: Tutor) => {
    const index = tutors.findIndex(tutor => tutor.id === updatedTutor.id);
    if(index !== -1) {
        tutors[index] = updatedTutor;
        revalidatePath('/tutors');
        revalidatePath(`/tutors/${updatedTutor.id}`);
        return tutors[index];
    }
    return null;
};
export const deleteTutor = (id: string) => {
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
export const getExpensesByDogId = (dogId: string) => expenses.filter(e => e.dogId === dogId);
export const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: String(Date.now()) };
    expenses.push(newExpense);
    revalidatePath(`/dogs/${expense.dogId}`);
    return newExpense;
}

// Sales
export const getSales = () => sales;
