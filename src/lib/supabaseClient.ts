import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend operations

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceKey) {
  // For server-side client, service key is preferred.
  // If you intend to use anon key for some specific server-side scenarios (not typical for CRUD), adjust accordingly.
  throw new Error("Missing env.SUPABASE_SERVICE_KEY");
}

// Create a single supabase client for use in server-side functions, API routes, etc.
// For RLS to work effectively when using the service_role key,
// you often need to explicitly set the user context, e.g., by passing the JWT.
// However, for basic admin-level operations from the backend (like in API routes where you first verify the user via Clerk),
// the service_role key bypasses RLS by default.
// If you need to enforce RLS based on the calling user even with service_role,
// you might need a more complex setup or use the anon key with user's JWT.

// This client uses the service_role key and will bypass RLS unless specific measures are taken.
// It's suitable for API routes where you manually check user authentication (e.g., via Clerk)
// and then perform operations on their behalf.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // persistSession: false, // Optional: disable session persistence for server-only client
    // autoRefreshToken: false, // Optional: disable auto refresh for server-only client
  }
});

// If you need a client that respects RLS based on a user's JWT (e.g., from client-side components or server components
// where you pass the user's access token), you might create another client instance or a helper function:
// export const createSupabaseClientForUser = (accessToken: string): SupabaseClient => {
//   return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   });
// };
