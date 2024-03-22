#!/usr/bin/env node
import "dotenv/config";
import axios from "axios";
import { OpenAPIV3 } from "openapi-types";
import { version } from "./package.json";
import SwaggerParser from "@apidevtools/swagger-parser";
import { ensureDir, remove, writeFile } from "fs-extra";
import { DIRECTORY, log, logError } from "./src/utils";
import { parseHookFiles } from "./src/hooks";
import openapiTS, { astToString } from "openapi-typescript";

// const writeFiles = async (
//   supabaseFile: File,
//   hookFiles: HookFile[],
//   metadataFile: File,
//   componentFiles: {
//     tableComponents: File[];
//     joinTableComponents: File[];
//     viewComponents: File[];
//   }
// ) => {
//   await writeFile(
//     `${DIRECTORY}/${supabaseFile.fileName}`,
//     supabaseFile.content
//   );
//   await Promise.all(
//     hookFiles.map((hookFile) => {
//       const { file, location } = hookFile;
//       return writeFile(location, file.content);
//     })
//   );
//   await writeFile(
//     `${DIRECTORY}/${metadataFile.fileName}`,
//     metadataFile.content
//   );

//   const tableComponentPromises = componentFiles.tableComponents.map(
//     (componentFile) => {
//       return writeFile(
//         `${DIRECTORY}/components/tables/${componentFile.fileName}`,
//         componentFile.content
//       );
//     }
//   );
//   const joinTableComponentPromises = componentFiles.joinTableComponents.map(
//     (componentFile) => {
//       return writeFile(
//         `${DIRECTORY}/components/joinTables/${componentFile.fileName}`,
//         componentFile.content
//       );
//     }
//   );
//   const viewComponentPromises = componentFiles.viewComponents.map(
//     (componentFile) => {
//       return writeFile(
//         `${DIRECTORY}/components/views/${componentFile.fileName}`,
//         componentFile.content
//       );
//     }
//   );
//   await Promise.all([
//     ...tableComponentPromises,
//     ...joinTableComponentPromises,
//     ...viewComponentPromises,
//   ]);
// };

const run = async () => {
  log(`Starting code generation (v${version})`);

  const containerApiUrl = "https://backengine-staging-w4n0.fly.dev";

  const ast = await openapiTS(new URL(`${containerApiUrl}/api/docs/json`));
  const contents = astToString(ast);

  const response = await axios.get(`${containerApiUrl}/api/docs/json`);
  const openApiDoc = (await SwaggerParser.dereference(
    response.data
  )) as OpenAPIV3.Document;

  await remove(DIRECTORY);
  await ensureDir(DIRECTORY);
  await writeFile(`${DIRECTORY}/schema.ts`, contents);
  await ensureDir(`${DIRECTORY}/hooks`);

  parseHookFiles(containerApiUrl, openApiDoc);
  // const hookFiles = parseHookFiles();

  // const types = await fetchTypes();

  // await remove(DIRECTORY);
  // await ensureDir(`${DIRECTORY}/hooks`);
  // await ensureDir(`${DIRECTORY}/components/tables`);
  // await ensureDir(`${DIRECTORY}/components/joinTables`);
  // await ensureDir(`${DIRECTORY}/components/views`);
  // await writeFile(`${DIRECTORY}/${types.fileName}`, types.content);

  // const supabaseFile = await parseSupabaseFile();
  // const hookFiles = await parseHookFiles();
  // const metadataFile = await parseMetadataFile(hookFiles);
  // const componentFiles = await parseComponentFiles(hookFiles);

  // await writeFiles(supabaseFile, hookFiles, metadataFile, componentFiles);

  // log(`Generated ${hookFiles.length + 1} files in "${DIRECTORY}"`);
  log("Code generation completed 🚀");
};

run().catch((error) => logError("Code generation failed ❌", error));
