import { OpenAPIV3 } from "openapi-types";
import type { HookFile } from "../types";
import { generateGetHook } from "./get";
import { generatePostHook } from "./post";

// TODO: generated ts types
// TODO: error/loading states
// TODO: metadata files
// TODO: use axios
export const parseHookFiles = async (
  containerApiUrl: string,
  openApiDoc: OpenAPIV3.Document
): Promise<HookFile[]> => {
  const pathNames = Object.keys(openApiDoc.paths);
  for (const pathName of pathNames) {
    const path = openApiDoc.paths[pathName];

    if (path?.get) {
      await generateGetHook(pathName, containerApiUrl);
    }
    if (path?.post) {
      await generatePostHook(pathName, containerApiUrl);
    }
    // TODO: patch, put, delete
  }

  return [];
};
