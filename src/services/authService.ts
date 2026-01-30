import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        role: 'user', // Store role in user metadata
      },
    },
  });

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign up failed: No user returned');
  }

  // Fetch the newly created profile
  const userProfile = await getUserData(data.user.id);
  if (!userProfile) {
    throw new Error('Failed to create user profile');
  }

  return userProfile;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign in failed: No user returned');
  }

  // Fetch user profile
  const userProfile = await getUserData(data.user.id);
  if (!userProfile) {
    throw new Error('Failed to fetch user profile');
  }

  return userProfile;
};

export const signInWithGoogle = async (): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    throw new Error(`Google sign in failed: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Google sign in failed: No user returned');
  }

  // Profile will be auto-created via trigger
  const userProfile = await getUserData(data.user.id);
  if (!userProfile) {
    throw new Error('Failed to fetch user profile');
  }

  return userProfile;
};

/**
 * Get current user from session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  return getUserData(data.user.id);
};

/**
 * Get user data from profiles table
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching user data:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    uid: data.id,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    role: data.role as 'user' | 'admin',
    createdAt: new Date(data.created_at),
  };
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const userProfile = await getUserData(session.user.id);
      callback(userProfile);
    } else {
      callback(null);
    }
  });

  // Return unsubscribe function
  return data.subscription.unsubscribe;
};
