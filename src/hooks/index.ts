import type { HookFile } from "../types";
import { parseTableFiles } from "./table";
import { parseViewFiles } from "./view";

export const parseHookFiles = async (): Promise<HookFile[]> => {
  const tableFiles = await parseTableFiles();
  const viewFiles = await parseViewFiles();
  return [...tableFiles, ...viewFiles];
};
