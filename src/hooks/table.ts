import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { DIRECTORY, parseNameFormats } from "../utils";
import { TableResponse, TablesResponse } from "../pgMeta/fetchTables";

const mapTableToFile = async (table: TableResponse): Promise<HookFile> => {
  const { name: tableName } = table;
  const { pascalCase, pascalCasePlural, camelCase, camelCasePlural } =
    parseNameFormats(tableName);

  const content = `
    ${comment}

    import { useState, useEffect } from "react";
    import { supabase } from "../supabase";
    import { Database } from "../types";

    type Table = Database["public"]["Tables"]["${tableName}"]
    export type Row = Table["Row"];
    export type Insert${pascalCase} = Table["Insert"];
    export type Update${pascalCase} = Table["Update"];

    const use${pascalCasePlural} = () => {
      const [${camelCasePlural}, set${pascalCasePlural}] = useState<Row[]>([]);

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
        const { data, error } = await supabase
          .from("${tableName}")
          .insert([newData])
          .select();
        if (error) {
          throw error;
        }
        set${pascalCasePlural}([...${camelCasePlural}, data[0]]);
        return data[0]
      };

      const update${pascalCase} = async (id: Row["id"], updatedData: Update${pascalCase}) => {
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
        return data[0];
      };

      const delete${pascalCase} = async (id: Row["id"]): Promise<number | null> => {
        const { error, count } = await supabase
          .from("${tableName}")
          .delete({ count: "exact" })
          .eq("id", id);
        if (error) {
          throw error;
        }
        const filtered = ${camelCasePlural}.filter((${camelCase}) => ${camelCase}.id !== id);
        set${pascalCasePlural}(filtered);
        return count
      };

      return { ${camelCasePlural}, fetch${pascalCasePlural}, create${pascalCase}, update${pascalCase}, delete${pascalCase} };
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
  const usage = `const { ${camelCasePlural}, fetch${pascalCasePlural}, create${pascalCase}, update${pascalCase}, delete${pascalCase} } = use${pascalCasePlural}();`;

  return {
    file,
    location: `${DIRECTORY}/hooks/${file.fileName}.ts`,
    type: "HOOK",
    entityType: "TABLE",
    entityName: tableName,
    usage,
  };
};

export const parseTableFiles = async (
  tables: TablesResponse
): Promise<HookFile[]> => {
  const tableHookPromises = tables.map<Promise<HookFile>>(mapTableToFile);
  const tableFiles = await Promise.all(tableHookPromises);

  return tableFiles;
};
