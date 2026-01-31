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
  let data, error;
  try {
    const result = await retryWithBackoff(
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
    data = result.data;
    error = result.error;
  } catch (err: any) {
    throw new Error(`Sign up failed: ${err.message || 'Network error'}`);
  }

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign up failed: No user returned');
  }

  // Return user immediately - profile will be synced by AuthContext
  // The database trigger will create the profile in the background
  return {
    uid: data.user.id,
    email: data.user.email || email,
    displayName: displayName,
    photoURL: null,
    role: 'user',
    createdAt: new Date(),
  };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  let data, error;
  try {
    const result = await retryWithBackoff(
      () =>
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
      3,
      1000
    );
    data = result.data;
    error = result.error;
  } catch (err: any) {
    throw new Error(`Sign in failed: ${err.message || 'Network error'}`);
  }

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('Sign in failed: No user returned');
  }

  // Return user immediately - profile will be synced by AuthContext
  return {
    uid: data.user.id,
    email: data.user.email || email,
    displayName: data.user.user_metadata?.display_name || email.split('@')[0],
    photoURL: data.user.user_metadata?.photo_url || null,
    role: (data.user.user_metadata?.role as 'user' | 'admin') || 'user',
    createdAt: new Date(data.user.created_at || new Date()),
  };
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
 * Resend email confirmation
 */
export const resendConfirmationEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) {
    throw new Error(`Failed to resend confirmation email: ${error.message}`);
  }
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
 * Get user data from profiles table with retry logic
 */
export const getUserData = async (
  userId: string,
  retries: number = 3,
  delay: number = 1000
): Promise<User | null> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    let data, error;
    try {
      const result = await supabase.from('profiles').select('*').eq('id', userId).single();
      data = result.data;
      error = result.error;
    } catch (err: any) {
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - profile doesn't exist yet
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }

    if (!data) {
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
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
  }

  // All retries exhausted, profile not found
  return null;
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
 * Promote user to admin role
 */
export const promoteToAdmin = async (email: string): Promise<void> => {
  const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('email', email);

  if (error) {
    throw new Error(`Failed to promote user to admin: ${error.message}`);
  }
};

/**
 * Demote admin to regular user role
 */
export const demoteFromAdmin = async (email: string): Promise<void> => {
  const { error } = await supabase.from('profiles').update({ role: 'user' }).eq('email', email);

  if (error) {
    throw new Error(`Failed to demote user: ${error.message}`);
  }
};

/**
 * Get user's role
 */
export const getUserRole = async (email: string): Promise<'user' | 'admin' | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return (data?.role as 'user' | 'admin') || null;
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
