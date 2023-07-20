import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vwthapyxsokzpwcbegok.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dGhhcHl4c29renB3Y2JlZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MTE2NTcsImV4cCI6MjAwNTE4NzY1N30.3qZk_ZMniTDZ1XuB7_Qgrjm7YDdLZGk4IqypUYOcz04";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
