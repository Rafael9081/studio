
'use server';

import { auth } from './config';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';

export async function signInUser(email: string, password: string):Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function createTestUser() {
    try {
        await createUserWithEmailAndPassword(auth, 'test@example.com', 'password');
    } catch (error: any) {
        if (error.code !== 'auth/email-already-in-use') {
            console.error("Error creating test user:", error);
        }
    }
}

// In a real app, you might call this at startup or via a script
createTestUser();


export async function signOut() {
    await firebaseSignOut(auth);
}
