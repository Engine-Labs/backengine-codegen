import type { File, HookFile } from "../types";
import { parseTableFiles } from "./table";
import { parseViewFiles } from "./view";

export const parseHookFiles = async (types: File): Promise<HookFile[]> => {
  const tableFiles = await parseTableFiles(types);
  const viewFiles = await parseViewFiles(types);
  return [...tableFiles, ...viewFiles];
};
