import { fetchTables } from "../pgMeta/fetchTables";
import type { File, HookFile } from "../types";
import { parseComponentFilesForTables } from "./tables";
import { parseComponentFilesForViews } from "./views";

export const parseComponentFiles = async (
  hookFiles: HookFile[]
): Promise<{ tableComponents: File[]; viewComponents: File[] }> => {
  const { tables } = await fetchTables();

  const tableComponents = await parseComponentFilesForTables(hookFiles, tables);
  const viewComponents = await parseComponentFilesForViews(hookFiles);

  return {
    tableComponents,
    viewComponents,
  };
};
