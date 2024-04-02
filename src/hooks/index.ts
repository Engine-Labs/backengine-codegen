import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import { DIRECTORY, logError } from "../utils";
import { generateLoginHook } from "./auth";
import {
  generateDeleteHook,
  generateGetHook,
  generatePostHook,
} from "./methods";

export type HookMetadata = {
  hookName: string;
  definition: string;
  import: string;
  parameters?: OpenAPIV3.ParameterObject[];
  response?: OpenAPIV3.MediaTypeObject;
  request?: OpenAPIV3.MediaTypeObject;
};

export const parseHookFiles = async (
  containerApiUrl: string,
  openApiDoc: OpenAPIV3.Document
): Promise<void> => {
  const pathNames = Object.keys(openApiDoc.paths);

  const metadata: HookMetadata[] = [];

  metadata.push(await generateLoginHook(containerApiUrl));

  await Promise.all(
    pathNames
      .filter((pathName) => pathName !== "/api/login")
      .map(async (pathName): Promise<void> => {
        const path = openApiDoc.paths[pathName];

        if (path?.get) {
          try {
            const getMetadata = await generateGetHook(
              pathName,
              containerApiUrl,
              path.get.responses,
              path.get.parameters as OpenAPIV3.ParameterObject[]
            );
            metadata.push(getMetadata);
          } catch (e) {
            logError(`Failed to generate for GET ${pathName}`, e);
          }
        }

        if (path?.post) {
          try {
            const postMetadata = await generatePostHook(
              pathName,
              containerApiUrl,
              path.post.responses,
              path.post.requestBody as OpenAPIV3.RequestBodyObject,
              path.post.parameters as OpenAPIV3.ParameterObject[]
            );
            metadata.push(postMetadata);
          } catch (e) {
            logError(`Failed to generate for POST ${pathName}`, e);
          }
        }

        if (path?.delete) {
          try {
            const deleteMetadata = await generateDeleteHook(
              pathName,
              containerApiUrl,
              path.delete.responses,
              path.delete.parameters as OpenAPIV3.ParameterObject[]
            );
            metadata.push(deleteMetadata);
          } catch (e) {
            logError(`Failed to generate for DELETE ${pathName}`, e);
          }
        }

        // TODO: put, patch
      })
  );

  const formattedContent = await prettier.format(JSON.stringify(metadata), {
    parser: "json",
  });
  await writeFile(`${DIRECTORY}/metadata.json`, formattedContent);
};
