import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';
import { getUserData } from '../services/authService';

interface AuthContextType {
    currentUser: FirebaseUser | null;
    userData: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userData: null,
    loading: true,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const data = await getUserData(user.uid);
                setUserData(data);
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
