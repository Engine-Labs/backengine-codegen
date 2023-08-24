import prettier from "prettier";
import comment from "../comment";
import { TableResponse, TablesResponse } from "../pgMeta/fetchTables";
import type { File, HookFile } from "../types";
import { DIRECTORY, parseNameFormats } from "../utils";

const mapJoinTableToFile = async (
  joinTable: TableResponse
): Promise<HookFile> => {
  const joinTableFormats = parseNameFormats(joinTable.name);

  const tableOneFormats = parseNameFormats(
    joinTable.relationships.at(0)!.targetTableName
  );
  const tableTwoFormats = parseNameFormats(
    joinTable.relationships.at(1)!.targetTableName
  );

  const tableOneFetchFunctionName = `fetch${tableTwoFormats.pascalCasePlural}For${tableOneFormats.pascalCase}`;
  const tableTwoFetchFunctionName = `fetch${tableOneFormats.pascalCasePlural}For${tableTwoFormats.pascalCase}`;

  const content = `
    ${comment}

    import { supabase } from "../supabase";
    import { Database } from "../types";

    type ${tableOneFormats.pascalCase}Row = Database["public"]["Tables"]["${tableOneFormats.name}"]["Row"]
    type ${tableTwoFormats.pascalCase}Row = Database["public"]["Tables"]["${tableTwoFormats.name}"]["Row"]

    const use${joinTableFormats.pascalCasePlural} = () => {
      const ${tableOneFetchFunctionName} = async(id: ${tableOneFormats.pascalCase}Row["id"]) => {
        try {
          const { data, error } = await supabase
            .from("${tableOneFormats.name}")
            .select("*, ${tableTwoFormats.name}(*)")
            .eq("id", id);
          if (error) {
            throw error;
          }
          return data
        } catch (error) {
          console.error("Error fetching", error);
        }
      };

      const ${tableTwoFetchFunctionName} = async(id: ${tableTwoFormats.pascalCase}Row["id"]) => {
        try {
          const { data, error } = await supabase
            .from("${tableTwoFormats.name}")
            .select("*, ${tableOneFormats.name}(*)")
            .eq("id", id);
          if (error) {
            throw error;
          }
          return data
        } catch (error) {
          console.error("Error fetching", error);
        }
      };

      return { ${tableOneFetchFunctionName}, ${tableTwoFetchFunctionName} };
    };

    export default use${joinTableFormats.pascalCasePlural};
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  const file: File = {
    fileName: `use${joinTableFormats.pascalCasePlural}`,
    content: formattedContent,
  };
  const usage = `const { ${tableOneFetchFunctionName} } = use${joinTableFormats.pascalCasePlural}();`;

  return {
    file,
    location: `${DIRECTORY}/hooks/${file.fileName}.ts`,
    type: "HOOK",
    entityType: "JOIN_TABLE",
    entityName: joinTableFormats.name,
    usage,
  };
};

export const parseJoinTableFiles = async (
  joinTables: TablesResponse
): Promise<HookFile[]> => {
  const joinTableHookPromises =
    joinTables.map<Promise<HookFile>>(mapJoinTableToFile);
  const joinTableFiles = await Promise.all(joinTableHookPromises);

  return joinTableFiles;
};
