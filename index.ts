#!/usr/bin/env node
import { ensureDir, remove, writeFile } from "fs-extra";
import { parseSupabaseFile } from "./src/supabase";
import { parseHookFiles } from "./src/hooks";
import { fetchTables } from "./src/tables";
import { log } from "./src/log";
import "dotenv/config";

const directory = process.env.IS_DEV ? "__backengine__" : "src/__backengine__";

const run = async () => {
  log("Starting code generation");
  const tables = await fetchTables();

  const supabaseFile = await parseSupabaseFile();
  const hookFiles = await parseHookFiles(tables);

  await remove(directory);
  await ensureDir(`${directory}/hooks`);

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
