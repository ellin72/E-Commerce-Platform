import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import type { Database } from '../types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

/**
 * Retry helper with exponential backoff for rate-limited requests
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Only retry on 429 (Too Many Requests) errors
      if (error.status !== 429) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const { data, error } = await retryWithBackoff(
    () =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: 'user', // Store role in user metadata
          },
        },
      }),
    3,
    1000
  );

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
  const { data, error } = await retryWithBackoff(
    () =>
      supabase.auth.signInWithPassword({
        email,
        password,
      }),
    3,
    1000
  );

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

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    throw new Error(`Google sign in failed: ${error.message}`);
  }

  // OAuth redirects to provider, user data will be available after redirect
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

  const profileData = data as ProfileRow;
  return {
    uid: profileData.id,
    email: profileData.email,
    displayName: profileData.display_name,
    photoURL: profileData.photo_url,
    role: profileData.role as 'user' | 'admin',
    createdAt: new Date(profileData.created_at),
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
  const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
