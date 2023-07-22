import prettier from "prettier";
import type { File } from "./types";

export const parseSupabaseFile = async (): Promise<File> => {
  const content = `
    import { createClient } from "@supabase/supabase-js";
    import type { Database } from "./types";

    const supabaseUrl = "${process.env.SUPABASE_URL}"; 
    const supabaseAnonKey = "${process.env.SUPABASE_ANON_KEY}";

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    export { supabase };
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  return {
    fileName: "supabase.ts",
    content: formattedContent,
  };
};
