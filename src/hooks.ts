import {
  camelCase as toCamelCase,
  pascalCase as toPascalCase,
} from "change-case-all";
import { plural, singular } from "pluralize";
import prettier from "prettier";
import type { File, Table, Tables } from "./types";

const parseNameFormats = (
  name: string
): {
  pascalCase: string;
  pascalCasePlural: string;
  camelCase: string;
  camelCasePlural: string;
} => {
  return {
    pascalCase: singular(toPascalCase(name)),
    pascalCasePlural: plural(toPascalCase(name)),
    camelCase: singular(toCamelCase(name)),
    camelCasePlural: plural(toCamelCase(name)),
  };
};

const mapTableToFile = async (table: Table): Promise<File> => {
  const { pascalCase, pascalCasePlural, camelCase, camelCasePlural } =
    parseNameFormats(table.name);

  const content = `
    import { useState, useEffect } from "react";
    import { supabase } from "../supabase";
    import { Database } from "../types";

    type Table = Database["public"]["Tables"]["${table.name}"]
    type ${pascalCase} = Table["Row"];
    type Insert${pascalCase} = Table["Insert"];
    type Update${pascalCase} = Table["Update"];

    const use${pascalCasePlural} = () => {
      const [${camelCasePlural}, set${pascalCasePlural}] = useState<${pascalCase}[]>([]);

      useEffect(() => {
        fetch${pascalCasePlural}();
      }, []);

      const fetch${pascalCasePlural} = async() => {
          try {
            const { data, error } = await supabase
              .from("${table.name}")
              .select("*");
            if (error) { 
              throw error;
            }
            set${pascalCasePlural}(data || []);
          } catch (error) {
            console.error("Error fetching", error);
          }
      };

      const create${pascalCase} = async (newData: Insert${pascalCase}) => {
        try {
          const { data, error } = await supabase
            .from("${table.name}")
            .insert([newData])
            .select("*");
          if (error) {
            throw error;
          }
          set${pascalCasePlural}([...${camelCasePlural}, data[0]]);
        } catch (error) {
          console.error("Error creating", error);
        }
      };

      const update${pascalCase} = async (id: number, updatedData: Update${pascalCase}) => {
        try {
          const { data, error } = await supabase
            .from("${table.name}")
            .update(updatedData)
            .eq("id", id)
            .select("*");
          if (error) {
            throw error;
          }
          set${pascalCasePlural}(
            ${camelCasePlural}.map((${camelCase}) =>
              ${camelCase}.id === id ? { ...${camelCase}, ...data[0] } : ${camelCase}
            )
          );
        } catch (error) {
          console.error("Error updating alert:", error);
        }
      };

      const delete${pascalCase} = async (id: number) => {
        try {
          const { error } = await supabase
            .from("${table.name}")
            .delete()
            .eq("id", id);
          if (error) {
            throw error;
          }
          const filtered = ${camelCasePlural}.filter((${camelCase}) => ${camelCase}.id !== id);
          set${pascalCasePlural}(filtered);
        } catch (error) {
          console.error("Error deleting", error);
        }
      };

      return { ${camelCasePlural}, create${pascalCase}, update${pascalCase}, delete${pascalCase} };
    };

    export default use${pascalCasePlural};
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  const file: File = {
    fileName: `use${pascalCasePlural}`,
    content: formattedContent,
  };
  return file;
};

export const parseHookFiles = async (tables: Tables): Promise<File[]> => {
  const hookPromises = tables
    .filter((table) => table.schema === "public")
    .map<Promise<File>>(mapTableToFile);
  const files = await Promise.all(hookPromises);
  return files;
};
