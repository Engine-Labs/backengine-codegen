#!/usr/bin/env node
import { ensureDir, remove, writeFile } from "fs-extra";
import { parseSupabaseFile } from "./src/supabase";
import { parseHookFiles } from "./src/hooks";
import gradient from "gradient-string";
import "dotenv/config";

export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// TODO: probably want an env variable here
const directory = false ? "dev-src" : "src/__backengine__";
const supagradient = gradient(["#00CB8A", "#78E0B8"]);

// TODO: type safety
const run = async () => {
  const supabaseFile = await parseSupabaseFile();
  const hookFiles = await parseHookFiles();

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

  console.log(supagradient("Backengine code generation completed 🚀"));
};

run();
