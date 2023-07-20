import prettier from "prettier";
import type { File, Tables } from "./types";
import pluralize from "pluralize";
import { camelCase, pascalCase } from "change-case-all";

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
  {
    id: 28655,
    schema: "public",
    name: "tasks",
    rls_enabled: true,
    rls_forced: false,
    replica_identity: "DEFAULT",
    bytes: 8192,
    size: "8192 bytes",
    live_rows_estimate: 0,
    dead_rows_estimate: 0,
    comment: null,
    primary_keys: [
      {
        schema: "public",
        table_name: "tasks",
        name: "id",
        table_id: 28655,
      },
    ],
    relationships: [],
  },
];

export const parseHookFiles = async (): Promise<File[]> => {
  const hookPromises = tables
    .filter((table) => table.schema === "public")
    .map<Promise<File>>(async (table) => {
      const pascalCaseName = pluralize(pascalCase(table.name));
      const camelCaseName = pluralize(camelCase(table.name));

      const content = `
        import { useState, useEffect } from "react";
        import { supabase } from "../supabase";
      
        const use${pascalCaseName} = () => {
          const [${camelCaseName}, set${pascalCaseName}] = useState<any[]>([]);

          useEffect(() => {
            fetch${pascalCaseName}();
          }, []);

          const fetch${pascalCaseName} = async() => {
              try {
                const { data, error } = await supabase
                  .from("${table.name}")
                  .select("*");
                if (error) { 
                  throw error;
                }
                set${pascalCaseName}(data || []);
              } catch (error) {
                console.error("Error fetching", error);
              }
          };

          return { ${camelCaseName} };
        };

        export default use${pascalCaseName};
      `;

      const formattedContent = await prettier.format(content, {
        parser: "typescript",
      });

      const file: File = {
        fileName: camelCase(table.name),
        content: formattedContent,
      };
      return file;
    });
  return await Promise.all(hookPromises);
};
