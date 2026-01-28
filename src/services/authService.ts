import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user document in Firestore
    const userData: Omit<User, 'uid'> = {
        email: firebaseUser.email,
        displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user',
        createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
    });

    return {
        uid: firebaseUser.uid,
        ...userData,
    };
};

export const signInWithEmail = async (
    email: string,
    password: string
): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const signInWithGoogle = async (): Promise<User> => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const firebaseUser = userCredential.user;

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
        const userData: Omit<User, 'uid'> = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...userData,
            createdAt: serverTimestamp(),
        });

        return {
            uid: firebaseUser.uid,
            ...userData,
        };
    }

    return userDoc.data() as User;
};

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

export const getUserData = async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
        return null;
    }

    return {
        uid,
        ...userDoc.data(),
    } as User;
};
