import { fetchTables } from "../pgMeta/fetchTables";
import type { File, HookFile } from "../types";
import { parseComponentFilesForTables } from "./tables";
import { parseComponentFilesForJoinTables } from "./joinTables";
import { parseComponentFilesForViews } from "./views";

export const parseComponentFiles = async (
  hookFiles: HookFile[]
): Promise<{
  tableComponents: File[];
  joinTableComponents: File[];
  viewComponents: File[];
}> => {
  const { tables, joinTables } = await fetchTables();

  const tableComponents = await parseComponentFilesForTables(hookFiles, tables);
  const joinTableComponents = await parseComponentFilesForJoinTables(
    hookFiles,
    joinTables
  );
  const viewComponents = await parseComponentFilesForViews(hookFiles);

  return {
    tableComponents,
    joinTableComponents,
    viewComponents,
  };
};
