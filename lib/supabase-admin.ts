import { createClient } from '@supabase/supabase-js';

// Service role client — server-side only, never exposed to browser
// Use only inside Server Actions (app/actions/admin.ts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
