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
  componentFiles: File[]
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
  await Promise.all(
    componentFiles.map((hookFile) => {
      return writeFile(
        `${DIRECTORY}/components/${hookFile.fileName}`,
        hookFile.content
      );
    })
  );
};

const run = async () => {
  log(`Starting code generation (v${version})`);
  const types = await fetchTypes();

  await remove(DIRECTORY);
  await ensureDir(`${DIRECTORY}/hooks`);
  await ensureDir(`${DIRECTORY}/components`);
  await writeFile(`${DIRECTORY}/${types.fileName}`, types.content);

  const supabaseFile = await parseSupabaseFile();
  const hookFiles = await parseHookFiles(types);
  const metadataFile = await parseMetadataFile(hookFiles);
  const componentFiles = await parseComponentFiles(hookFiles);

  await writeFiles(supabaseFile, hookFiles, metadataFile, componentFiles);

  log(`Generated ${hookFiles.length + 1} files in "${DIRECTORY}"`);
  log("Code generation completed 🚀");
};

run().catch((error) => logError("Code generation failed ❌", error));
