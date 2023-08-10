import axios from "axios";
import prettier from "prettier";
import type { paths } from "../__generated__/types";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { DIRECTORY, log, parseNameFormats } from "../utils";

export type TablesResponse =
  paths["/tables/"]["get"]["responses"]["200"]["content"]["application/json"];

const parseTableNames = async (): Promise<string[]> => {
  const tablesResponse = await axios.get<TablesResponse>(
    `${process.env.BACKENGINE_BASE_URL}/api/v1/projects/${process.env.BACKENGINE_PROJECT_ID}/pg-meta/tables`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BACKENGINE_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  log("Fetched table metadata");

  const publicTables = tablesResponse.data.filter(
    (table) => table.schema === "public"
  );

  return publicTables.map((table) => table.name);
};

const mapTableToFile = async (tableName: string): Promise<HookFile> => {
  const { pascalCase, pascalCasePlural, camelCase, camelCasePlural } =
    parseNameFormats(tableName);

  const content = `
    ${comment}

    import { useState, useEffect } from "react";
    import { supabase } from "../supabase";
    import { Database } from "../types";

    type Table = Database["public"]["Tables"]["${tableName}"]
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
              .from("${tableName}")
              .select();
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
            .from("${tableName}")
            .insert([newData])
            .select();
          if (error) {
            throw error;
          }
          set${pascalCasePlural}([...${camelCasePlural}, data[0]]);
        } catch (error) {
          console.error("Error creating", error);
        }
      };

      const update${pascalCase} = async (id: ${pascalCase}["id"], updatedData: Update${pascalCase}) => {
        try {
          const { data, error } = await supabase
            .from("${tableName}")
            .update(updatedData)
            .eq("id", id)
            .select();
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

      const delete${pascalCase} = async (id: ${pascalCase}["id"]) => {
        try {
          const { error } = await supabase
            .from("${tableName}")
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
  const usage = `const { ${camelCasePlural}, create${pascalCase}, update${pascalCase}, delete${pascalCase} } = use${pascalCasePlural}();`;

  return {
    file,
    location: `${DIRECTORY}/hooks/${file.fileName}.ts`,
    type: "HOOK",
    entity: "TABLE",
    usage,
  };
};

export const parseTableFiles = async (): Promise<HookFile[]> => {
  const tableNames = await parseTableNames();
  const hookPromises = tableNames.map<Promise<HookFile>>(mapTableToFile);
  const files = await Promise.all(hookPromises);
  return files;
};
