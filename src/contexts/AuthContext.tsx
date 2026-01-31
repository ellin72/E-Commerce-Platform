import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUserData } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getUserData(session.user.id);

        if (profile) {
          setCurrentUser(profile);
          setUserData(profile);
        } else {
          const fallbackUser: User = {
            uid: session.user.id,
            email: session.user.email || '',
            displayName:
              session.user.user_metadata?.display_name ||
              session.user.email?.split('@')[0] ||
              'User',
            photoURL: session.user.user_metadata?.photo_url || null,
            role: 'user',
            createdAt: new Date(session.user.created_at || new Date()),
          };
          setCurrentUser(fallbackUser);
          setUserData(fallbackUser);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
