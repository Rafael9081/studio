'use server';

import { type Dog, type Tutor, type Expense, type Sale, type GeneralExpense } from './types';
import { revalidatePath } from 'next/cache';
import { db } from './firebase/config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  query,
  where,
  writeBatch
} from 'firebase/firestore';

// Helper to convert Firestore Timestamps to JS Date objects
const convertTimestamps = (data: any) => {
  if (!data) return data;
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  }
  return data;
};


// Dogs
export const getDogs = async (): Promise<Dog[]> => {
  const dogsCol = collection(db, 'dogs');
  const dogsSnapshot = await getDocs(dogsCol);
  const dogsList = dogsSnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() })) as Dog[];
  return dogsList;
};

export const getDogById = async (id: string) => {
    const dogDocRef = doc(db, 'dogs', id);
    const dogSnap = await getDoc(dogDocRef);
    if(dogSnap.exists()) {
        return convertTimestamps({ id: dogSnap.id, ...dogSnap.data() }) as Dog;
    }
    return undefined;
};

export const addDog = async (dog: Omit<Dog, 'id' | 'status' | 'avatar'>) => {
  const newDog = { 
    ...dog, 
    status: 'Disponível', 
    avatar: `https://placehold.co/40x40.png?text=${dog.name.charAt(0)}` 
  };
  const dogsCol = collection(db, 'dogs');
  const docRef = await addDoc(dogsCol, newDog);
  revalidatePath('/dogs');
  revalidatePath('/dashboard');
  return { id: docRef.id, ...newDog };
};

export const updateDog = async (updatedDog: Omit<Dog, 'id'> & { id: string }) => {
    const dogDocRef = doc(db, 'dogs', updatedDog.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dogData } = updatedDog;
    await updateDoc(dogDocRef, dogData);
    revalidatePath('/dogs');
    revalidatePath(`/dogs/${updatedDog.id}`);
    revalidatePath(`/dogs/${updatedDog.id}/edit`);
    revalidatePath('/dashboard');
    return updatedDog;
}

export const deleteDog = async (id: string) => {
    const batch = writeBatch(db);

    // Delete the dog document
    const dogDocRef = doc(db, 'dogs', id);
    batch.delete(dogDocRef);

    // Delete related expenses
    const expensesQuery = query(collection(db, 'expenses'), where('dogId', '==', id));
    const expensesSnapshot = await getDocs(expensesQuery);
    expensesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete related sales
    const salesQuery = query(collection(db, 'sales'), where('dogId', '==', id));
    const salesSnapshot = await getDocs(salesQuery);
    salesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

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
        const salesCol = collection(db, 'sales');
        await addDoc(salesCol, sale);
        revalidatePath('/dashboard');
        revalidatePath('/dogs');
        revalidatePath('/sales');
    }
};


// Tutors
export const getTutors = async (): Promise<Tutor[]> => {
  const tutorsCol = collection(db, 'tutors');
  const tutorsSnapshot = await getDocs(tutorsCol);
  return tutorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tutor[];
};

export const getTutorById = async (id: string) => {
    const tutorDocRef = doc(db, 'tutors', id);
    const tutorSnap = await getDoc(tutorDocRef);
    return tutorSnap.exists() ? { id: tutorSnap.id, ...tutorSnap.data() } as Tutor : undefined;
};

export const addTutor = async (tutor: Omit<Tutor, 'id' | 'avatar'>) => {
    const newTutor = { ...tutor, avatar: 'https://placehold.co/40x40.png' };
    const tutorsCol = collection(db, 'tutors');
    const docRef = await addDoc(tutorsCol, newTutor);
    revalidatePath('/tutors');
    revalidatePath('/dashboard');
    return { id: docRef.id, ...newTutor };
};

export const updateTutor = async (updatedTutor: Tutor) => {
    const tutorDocRef = doc(db, 'tutors', updatedTutor.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...tutorData } = updatedTutor;
    await updateDoc(tutorDocRef, tutorData);
    revalidatePath('/tutors');
    revalidatePath(`/tutors/${updatedTutor.id}/edit`);
    return updatedTutor;
};

export const deleteTutor = async (id: string) => {
    await deleteDoc(doc(db, 'tutors', id));
    // Also clear tutorId from any dogs that might be associated
    const dogsQuery = query(collection(db, 'dogs'), where('tutorId', '==', id));
    const dogsSnapshot = await getDocs(dogsQuery);
    const batch = writeBatch(db);
    dogsSnapshot.forEach(doc => {
        batch.update(doc.ref, { tutorId: '' }); // or delete field
    });
    await batch.commit();

    revalidatePath('/tutors');
    revalidatePath('/dogs');
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
    const expensesCol = collection(db, 'expenses');
    const expensesSnapshot = await getDocs(expensesCol);
    return expensesSnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() })) as Expense[];
};

export const getExpensesByDogId = async (dogId: string) => {
    const expensesQuery = query(collection(db, 'expenses'), where('dogId', '==', dogId));
    const expensesSnapshot = await getDocs(expensesQuery);
    return expensesSnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() })) as Expense[];
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const expensesCol = collection(db, 'expenses');
    const docRef = await addDoc(expensesCol, expense);
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath(`/dogs/${expense.dogId}`);
    return { id: docRef.id, ...expense };
}

// General Expenses
export const getGeneralExpenses = async (): Promise<GeneralExpense[]> => {
    const expensesCol = collection(db, 'generalExpenses');
    const expensesSnapshot = await getDocs(expensesCol);
    return expensesSnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() })) as GeneralExpense[];
};

export const addGeneralExpense = async (expense: Omit<GeneralExpense, 'id'>) => {
    const expensesCol = collection(db, 'generalExpenses');
    const docRef = await addDoc(expensesCol, expense);
    revalidatePath('/dashboard');
    revalidatePath('/general-expenses');
    return { id: docRef.id, ...expense };
}


// Sales
export const getSales = async (): Promise<Sale[]> => {
    const salesCol = collection(db, 'sales');
    const salesSnapshot = await getDocs(salesCol);
    return salesSnapshot.docs.map(doc => convertTimestamps({ ...doc.data() })) as Sale[];
};