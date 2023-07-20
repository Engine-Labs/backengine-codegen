import prettier from "prettier";
import type { File } from "./types";

const content = `
  import { createClient, SupabaseClient } from "@supabase/supabase-js";

  const supabaseUrl = "${process.env.SUPABASE_URL}"; 
  const supabaseAnonKey = "${process.env.SUPABASE_ANON_KEY}";

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  export { supabase };
`;

export const parseSupabaseFile = async (): Promise<File> => {
  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  return {
    fileName: "supabase.ts",
    content: formattedContent,
  };
};
