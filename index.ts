#!/usr/bin/env node
import "dotenv/config";
import { ensureDir, remove, writeFile } from "fs-extra";
import { version } from "./package.json";
import { parseHookFiles } from "./src/hooks";
import { parseMetadataFile } from "./src/metadata";
import { parseSupabaseFile } from "./src/supabase";
import { parseComponentFiles } from "./src/components";
import { File, HookFile, fetchTypes } from "./src/types";
import { DIRECTORY, log, logError } from "./src/utils";

const writeFiles = async (
  supabaseFile: File,
  hookFiles: HookFile[],
  metadataFile: File,
  componentFiles: {
    tableComponents: File[];
    joinTableComponents: File[];
    viewComponents: File[];
  }
) => {
  await writeFile(
    `${DIRECTORY}/${supabaseFile.fileName}`,
    supabaseFile.content
  );
  await Promise.all(
    hookFiles.map((hookFile) => {
      const { file, location } = hookFile;
      return writeFile(location, file.content);
    })
  );
  await writeFile(
    `${DIRECTORY}/${metadataFile.fileName}`,
    metadataFile.content
  );

  const tableComponentPromises = componentFiles.tableComponents.map(
    (componentFile) => {
      return writeFile(
        `${DIRECTORY}/components/tables/${componentFile.fileName}`,
        componentFile.content
      );
    }
  );
  const joinTableComponentPromises = componentFiles.joinTableComponents.map(
    (componentFile) => {
      return writeFile(
        `${DIRECTORY}/components/joinTables/${componentFile.fileName}`,
        componentFile.content
      );
    }
  );
  const viewComponentPromises = componentFiles.viewComponents.map(
    (componentFile) => {
      return writeFile(
        `${DIRECTORY}/components/views/${componentFile.fileName}`,
        componentFile.content
      );
    }
  );
  await Promise.all([
    ...tableComponentPromises,
    ...joinTableComponentPromises,
    ...viewComponentPromises,
  ]);
};

const run = async () => {
  log(`Starting code generation (v${version})`);
  const types = await fetchTypes();

  await remove(DIRECTORY);
  await ensureDir(`${DIRECTORY}/hooks`);
  await ensureDir(`${DIRECTORY}/components/tables`);
  await ensureDir(`${DIRECTORY}/components/joinTables`);
  await ensureDir(`${DIRECTORY}/components/views`);
  await writeFile(`${DIRECTORY}/${types.fileName}`, types.content);

  const supabaseFile = await parseSupabaseFile();
  const hookFiles = await parseHookFiles();
  const metadataFile = await parseMetadataFile(hookFiles);
  const componentFiles = await parseComponentFiles(hookFiles);

  await writeFiles(supabaseFile, hookFiles, metadataFile, componentFiles);

  log(`Generated ${hookFiles.length + 1} files in "${DIRECTORY}"`);
  log("Code generation completed 🚀");
};

run().catch((error) => logError("Code generation failed ❌", error));
