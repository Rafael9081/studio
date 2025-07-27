'use server';

import { type Dog, type Tutor, type Expense, type Sale, type GeneralExpense } from './types';
import { type LitterData, type PuppyData } from '@/components/forms/litter-form';
import { revalidatePath } from 'next/cache';
import { db, storage } from './firebase/config';
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
import { 
  ref as storageRef, 
  uploadString, 
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

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

// Helper to upload image and get URL
const uploadImage = async (file: string, dogId: string): Promise<string> => {
    if (!file || !file.startsWith('data:image')) {
        // Not a new base64 image, return as is (might be existing URL or empty)
        return file;
    }
    const imageRef = storageRef(storage, `dogs/${dogId}/${new Date().getTime()}`);
    const snapshot = await uploadString(imageRef, file, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

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

export const addDog = async (dog: Omit<Dog, 'id' | 'status'>) => {
  const { avatar, ...dogData } = dog;
  const newDogPayload = { 
    ...dogData, 
    status: 'Disponível', 
    avatar: '' // Will be updated after getting the ID
  };
  const dogsCol = collection(db, 'dogs');
  const docRef = await addDoc(dogsCol, newDogPayload);

  let avatarUrl = `https://placehold.co/40x40.png?text=${dog.name.charAt(0)}`;
  if (avatar) {
      avatarUrl = await uploadImage(avatar, docRef.id);
  }
  
  await updateDoc(docRef, { avatar: avatarUrl });

  revalidatePath('/dogs');
  revalidatePath('/dashboard');
  return { id: docRef.id, ...newDogPayload, avatar: avatarUrl };
};

export const updateDog = async (updatedDog: Omit<Dog, 'id'> & { id: string }) => {
    const { id, avatar, ...dogData } = updatedDog;
    const dogDocRef = doc(db, 'dogs', id);

    const existingDog = await getDogById(id);

    // Only upload a new image if the avatar has changed and it's a base64 string
    if (avatar && avatar !== existingDog?.avatar && avatar.startsWith('data:image')) {
        const newAvatarUrl = await uploadImage(avatar, id);
        dogData.avatar = newAvatarUrl;
    } else {
        // Keep the old avatar if a new one isn't provided or it's the same URL
        dogData.avatar = existingDog?.avatar;
    }

    await updateDoc(dogDocRef, dogData);
    revalidatePath('/dogs');
    revalidatePath(`/dogs/${id}`);
    revalidatePath(`/dogs/${id}/edit`);
    revalidatePath('/dashboard');
    return { id, ...dogData };
}

export const deleteDog = async (id: string) => {
    const batch = writeBatch(db);
    const dogDocRef = doc(db, 'dogs', id);
    const dog = await getDogById(id);

    // Delete the dog document
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
    
    // Delete image from storage
    if (dog?.avatar && dog.avatar.includes('firebasestorage')) {
      try {
        const imageRef = storageRef(storage, dog.avatar);
        await deleteObject(imageRef);
      } catch (error: any) {
        if(error.code !== 'storage/object-not-found') {
          console.error("Error deleting dog avatar:", error)
        }
      }
    }

    await batch.commit();

    revalidatePath('/dogs');
    revalidatePath('/dashboard');
};

export const recordSale = async (sale: Omit<Sale, 'id'>) => {
    const dog = await getDogById(sale.dogId);
    if (dog) {
        const updatedDogData: Partial<Dog> = {
            status: 'Vendido',
            tutorId: sale.tutorId,
            salePrice: sale.price,
            dateOfSale: sale.date,
        }
        
        const dogDocRef = doc(db, 'dogs', dog.id);
        await updateDoc(dogDocRef, updatedDogData);

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
    const newTutor = { ...tutor, avatar: `https://placehold.co/40x40.png?text=${tutor.name.charAt(0)}` };
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
    return salesSnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() })) as Sale[];
};

// Litters
export const addLitter = async (litter: Omit<LitterData, 'puppies'> & { puppies: PuppyData[] }) => {
    const batch = writeBatch(db);
    const dogsCol = collection(db, 'dogs');

    for (const puppy of litter.puppies) {
        const newDogRef = doc(dogsCol); // Create a new document reference with an auto-generated ID

        const { avatar, ...puppyData } = puppy;

        const newDogPayload: Omit<Dog, 'id'> = {
            ...puppyData,
            breed: litter.breed,
            birthDate: litter.birthDate,
            fatherId: litter.fatherId,
            motherId: litter.motherId,
            status: 'Disponível',
            avatar: '', // Placeholder, will be updated
        };

        // Set the document data first (without avatar)
        batch.set(newDogRef, newDogPayload);
    }

    await batch.commit();

    // Now, let's handle the image uploads.
    // A better approach for production would be to trigger a cloud function
    // on document creation to handle image processing and updating.
    // For now, we'll re-fetch the newly created dogs to get their IDs.
     const newDogsQuery = query(
        dogsCol,
        where('motherId', '==', litter.motherId),
        where('birthDate', '==', litter.birthDate),
        litter.fatherId ? where('fatherId', '==', litter.fatherId) : where('fatherId', 'in', [null, undefined, ""])
    );

    const newDogsSnapshot = await getDocs(newDogsQuery);

    await Promise.all(newDogsSnapshot.docs.map(async (dogDoc) => {
        const dogData = dogDoc.data() as Dog;
        const correspondingPuppy = litter.puppies.find(p => p.name === dogData.name && p.sex === dogData.sex);

        if (correspondingPuppy?.avatar) {
            const avatarUrl = await uploadImage(correspondingPuppy.avatar, dogDoc.id);
            await updateDoc(doc(db, 'dogs', dogDoc.id), { avatar: avatarUrl });
        } else {
            const avatarUrl = `https://placehold.co/40x40.png?text=${dogData.name.charAt(0)}`;
            await updateDoc(doc(db, 'dogs', dogDoc.id), { avatar: avatarUrl });
        }
    }));


    revalidatePath('/dogs');
    revalidatePath('/dashboard');
    revalidatePath('/litters');
};
