import type { TablesResponse } from "../../pgMeta/fetchTables";
import { parseNameFormats } from "../../utils";

export const parseFetchFunctionNamesForJoinTable = (
  joinTables: TablesResponse,
  entityName: string
) => {
  const joinTable = joinTables.find((table) => table.name === entityName)!;
  const tableOneFormats = parseNameFormats(
    joinTable.relationships.at(0)!.targetTableName
  );
  const tableTwoFormats = parseNameFormats(
    joinTable.relationships.at(1)!.targetTableName
  );
  const tableOneFetchFunctionName = `fetch${tableTwoFormats.pascalCasePlural}For${tableOneFormats.pascalCase}`;
  const tableTwoFetchFunctionName = `fetch${tableOneFormats.pascalCasePlural}For${tableTwoFormats.pascalCase}`;
  return { tableOneFetchFunctionName, tableTwoFetchFunctionName };
};
