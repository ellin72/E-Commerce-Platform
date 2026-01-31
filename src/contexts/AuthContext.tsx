import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
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
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // User is logged in
        const user: User = {
          uid: session.user.id,
          email: session.user.email || '',
          displayName:
            session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
          photoURL: session.user.user_metadata?.photo_url || null,
          role: (session.user.user_metadata?.role as 'user' | 'admin') || 'user',
          createdAt: new Date(session.user.created_at || new Date()),
        };

        setCurrentUser(user);
        setUserData(user);
      } else {
        // User is logged out
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
