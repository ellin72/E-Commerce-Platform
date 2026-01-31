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
  console.log('Starting signup for:', email);

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
    console.error('Signup request failed:', err);
    throw new Error(`Sign up failed: ${err.message || 'Network error'}`);
  }

  if (error) {
    console.error('Signup error:', error);
    throw new Error(`Sign up failed: ${error.message}`);
  }

  if (!data.user) {
    console.error('No user data returned from signup');
    throw new Error('Sign up failed: No user returned');
  }

  console.log('Signup successful:', data.user.id);
  console.log('Email confirmation required:', data.user.email_confirmed_at === null);
  console.log('User session:', data.session ? 'Active' : 'None (email confirmation required)');

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
  console.log('Starting login for:', email);

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
    console.error('Login request failed:', err);
    throw new Error(`Sign in failed: ${err.message || 'Network error'}`);
  }

  if (error) {
    console.error('Login error:', error);
    throw new Error(`Sign in failed: ${error.message}`);
  }

  if (!data.user) {
    console.error('No user data returned from login');
    throw new Error('Sign in failed: No user returned');
  }

  console.log('Login successful:', data.user.id);

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
  console.log('Attempting to resend confirmation email to:', email);

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) {
    console.error('Resend confirmation error:', error);
    throw new Error(`Failed to resend confirmation email: ${error.message}`);
  }

  console.log('Resend confirmation response:', data);
  console.log("⚠️ Email sent by Supabase. If you don't receive it, check:");
  console.log('  1. Spam/Junk folder');
  console.log('  2. Supabase Dashboard > Authentication > Settings > Email confirmations enabled');
  console.log('  3. Supabase Dashboard > Project Settings > Auth > SMTP settings configured');
  console.log('  4. Authentication > Email Templates > Confirm signup template exists');
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
  console.log('Fetching user data for:', userId);

  for (let attempt = 0; attempt < retries; attempt++) {
    let data, error;
    try {
      const result = await supabase.from('profiles').select('*').eq('id', userId).single();
      data = result.data;
      error = result.error;
    } catch (err: any) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, err.message);
      if (attempt < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      console.error('All fetch attempts failed');
      return null;
    }

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - profile doesn't exist yet
        console.log('No profile found for user:', userId);
        if (attempt < retries - 1) {
          console.log(`Profile not ready yet, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }
      console.error('Error fetching user data:', error);
      if (attempt < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }

    if (!data) {
      console.log('No data returned for user:', userId);
      if (attempt < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }

    console.log('User data fetched:', data);

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
  console.log('Profile not found after all retries');
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
