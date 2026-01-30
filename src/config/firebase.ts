// This file is kept for backward compatibility during migration
// All functionality has been moved to src/lib/supabaseClient.ts
//
// Migration Note: Firebase has been completely replaced with Supabase
// Please import from '../lib/supabaseClient' instead

export { supabase as default, getCurrentUser, getSession } from '../lib/supabaseClient';
