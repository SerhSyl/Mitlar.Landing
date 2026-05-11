require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('equipment').select('*');
  if (error) { console.error("ERROR:", error.message); process.exit(1); }
  console.log("SUCCESS. Row count:", data.length);
}
test();
