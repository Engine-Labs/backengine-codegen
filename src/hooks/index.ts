import { fetchTables } from "../pgMeta/fetchTables";
import type { HookFile } from "../types";
import { parseTableFiles } from "./table";
import { parseJoinTableFiles } from "./joinTable";
import { parseViewFiles } from "./view";

export const parseHookFiles = async (): Promise<HookFile[]> => {
  const { tables, joinTables } = await fetchTables();

  const tableFiles = await parseTableFiles(tables);
  const joinTableFiles = await parseJoinTableFiles(joinTables);
  const viewFiles = await parseViewFiles();
  return [...tableFiles, ...joinTableFiles, ...viewFiles];
};
