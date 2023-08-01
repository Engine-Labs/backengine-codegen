import prettier from "prettier";
import comment from "./comment";
import type { File } from "./types";

export const parseSupabaseFile = async (): Promise<File> => {
  const content = `
    ${comment}

    import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
    import type { Database } from "./types";
    
    const supabase = createClientComponentClient<Database>();
    
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
