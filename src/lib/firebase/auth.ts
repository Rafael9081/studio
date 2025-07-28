
'use client';

import { auth } from './config';
import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';

export async function signInUser(email: string, password: string):Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
    await firebaseSignOut(auth);
}
