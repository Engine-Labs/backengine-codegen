import { camelCase, pascalCase } from "change-case-all";
import prettier from "prettier";
import { ensureDir, writeFile } from "fs-extra";
import { Tables } from "./src/types";

// TODO: this is test data
const tables: Tables = [
  {
    id: 28641,
    schema: "public",
    name: "main_table",
    rls_enabled: false,
    rls_forced: false,
    replica_identity: "DEFAULT",
    bytes: 16384,
    size: "16 kB",
    live_rows_estimate: 0,
    dead_rows_estimate: 0,
    comment: null,
    primary_keys: [
      {
        schema: "public",
        table_name: "main_table",
        name: "id",
        table_id: 28641,
      },
    ],
    relationships: [],
  },
];

// TODO: type safety
const run = async () => {
  const supabase = `
    import { createClient, SupabaseClient } from "@supabase/supabase-js";

    const supabaseUrl = "YOUR_SUPABASE_URL"; // Replace with your Supabase URL
    const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your Supabase anonymous key

    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    export { supabase };
`;

  const hooks = tables
    .filter((table) => table.schema === "public")
    .map((table) => {
      const pascalCaseName = pascalCase(table.name);
      const camelCaseName = camelCase(table.name);

      return `
        import { useState, useEffect } from "react";
        import { supabase } from "../supabase";
      
        const use${pascalCaseName}s = () => {
          const [${camelCaseName}s, set${pascalCaseName}s] = useState([]);

          useEffect(() => {
            fetch${pascalCaseName}s();
          }, []);

          const fetch${pascalCaseName}s = async() => {
              try {
                const { data, error } = await supabase
                  .from("${table.name}")
                  .select("*");
                if (error) { 
                  throw error;
                }
                set${pascalCaseName}s(data || []);
              } catch (error) {
                console.error("Error fetching", error);
              }
          };

          return { ${camelCaseName}s };
        };
      `;
    });

  const formattedHook = await prettier.format(hooks[0], {
    parser: "typescript",
  });

  // TODO: probably want an env variable here
  const directory = "dev-src";

  await ensureDir(`${directory}/hooks`);
  await writeFile(`${directory}/supabase.ts`, supabase);
  await writeFile(`${directory}/hooks/main-tables.ts`, formattedHook);
  console.log("Generation finished 🚀");
};

run();
