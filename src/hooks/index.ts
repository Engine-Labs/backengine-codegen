import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import { DIRECTORY } from "../utils";
import { generateLoginHook } from "./auth";
import { generateGetHook } from "./get";
import type { HookMetadata } from "./types";

export const parseHookFiles = async (
  containerApiUrl: string,
  openApiDoc: OpenAPIV3.Document
): Promise<void> => {
  const pathNames = Object.keys(openApiDoc.paths);

  const metadata: HookMetadata[] = [];

  metadata.push(await generateLoginHook(containerApiUrl));

  await Promise.all(
    pathNames
      .filter((pathName) => !["/api/login", "/api/signup"].includes(pathName))
      .map(async (pathName) => {
        const path = openApiDoc.paths[pathName];

        if (path?.get) {
          metadata.push(
            await generateGetHook(
              pathName,
              containerApiUrl,
              path.get.parameters as OpenAPIV3.ParameterObject[]
            )
          );
        }
        // TODO: post, put, delete, patch
      })
  );

  const formattedContent = await prettier.format(JSON.stringify(metadata), {
    parser: "json",
  });
  await writeFile(`${DIRECTORY}/metadata.json`, formattedContent);
};
