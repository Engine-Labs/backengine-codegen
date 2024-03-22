import { OpenAPIV3 } from "openapi-types";
import { generateGetHook } from "./get";
import { generatePostHook } from "./post";
import { HookMetadata } from "./utils";

type File = {
  fileName: string;
  content: string;
};

export type HookFile = {
  file: File;
  location: string;
  type: "HOOK";
  entityType: "TABLE" | "JOIN_TABLE" | "VIEW";
  entityName: string;
  usage: string;
};

// TODO: error/loading states
// TODO: metadata files
// TODO: use axios
export const parseHookFiles = async (
  containerApiUrl: string,
  openApiDoc: OpenAPIV3.Document
): Promise<HookFile[]> => {
  const pathNames = Object.keys(openApiDoc.paths);

  const metadata: HookMetadata[] = [];

  await Promise.all(
    pathNames.map(async (pathName) => {
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
      if (path?.post) {
        metadata.push(
          await generatePostHook(
            pathName,
            containerApiUrl,
            path.post.parameters as OpenAPIV3.ParameterObject[],
            path.post.requestBody as OpenAPIV3.RequestBodyObject
          )
        );
      }
    })
  );

  console.log(JSON.stringify(metadata, null, 2));
  // for (const pathName of pathNames) {
  //   const path = openApiDoc.paths[pathName];

  //   const metadata: HookMetadata[] = [];
  //   if (path?.get) {
  //     metadata.push(
  //       await generateGetHook(
  //         pathName,
  //         containerApiUrl,
  //         path.get.parameters as OpenAPIV3.ParameterObject[]
  //       )
  //     );
  //   }
  //   if (path?.post) {
  //     metadata.push(
  //       await generatePostHook(
  //         pathName,
  //         containerApiUrl,
  //         path.post.parameters as OpenAPIV3.ParameterObject[],
  //         path.post.requestBody as OpenAPIV3.RequestBodyObject
  //       )
  //     );
  //   }
  //   // TODO: patch, put, delete
  // }

  return [];
};
