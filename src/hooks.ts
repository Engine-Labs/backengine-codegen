import { camelCase, pascalCase } from "change-case-all";
import pluralize from "pluralize";
import prettier from "prettier";
import type { File, Tables } from "./types";

export const parseHookFiles = async (tables: Tables): Promise<File[]> => {
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
