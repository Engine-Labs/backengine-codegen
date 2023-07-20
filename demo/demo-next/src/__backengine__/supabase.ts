import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL"; // Replace with your Supabase URL
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your Supabase anonymous key

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
