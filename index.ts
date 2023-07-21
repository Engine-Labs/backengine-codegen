#!/usr/bin/env node
import "dotenv/config";
import { ensureDir, remove, writeFile } from "fs-extra";
import { parseHookFiles } from "./src/hooks";
import { log } from "./src/log";
import { parseSupabaseFile } from "./src/supabase";
import { fetchTables } from "./src/tables";
import { fetchTypes } from "./src/types";

const directory = process.env.IS_DEV ? "__backengine__" : "src/__backengine__";

const run = async () => {
  log("Starting code generation");
  const tables = await fetchTables();
  const types = await fetchTypes();

  const supabaseFile = await parseSupabaseFile();
  const hookFiles = await parseHookFiles(tables);

  await remove(directory);
  await ensureDir(`${directory}/hooks`);

  await writeFile(`${directory}/${types.fileName}`, types.content);
  await writeFile(
    `${directory}/${supabaseFile.fileName}`,
    supabaseFile.content
  );
  await Promise.all(
    hookFiles.map((hookFile) => {
      return writeFile(
        `${directory}/hooks/${hookFile.fileName}.ts`,
        hookFile.content
      );
    })
  );

  log(`Generated ${hookFiles.length + 1} files in "${directory}"`);
  log("Code generation completed 🚀");
};

run();
