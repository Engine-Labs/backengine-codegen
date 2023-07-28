#!/usr/bin/env node
import "dotenv/config";
import { ensureDir, remove, writeFile } from "fs-extra";
import { parseHookFiles } from "./src/hooks";
import { log } from "./src/log";
import { parseSupabaseFile } from "./src/supabase";
import { File, fetchTypes } from "./src/types";
import { Project } from "ts-morph";

const directory = process.env.IS_DEV ? "__backengine__" : "src/__backengine__";

const fetchTableNames = (types: File): string[] => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `${directory}/${types.fileName}`
  );

  const node = sourceFile.getInterface("Database")!;
  const tables = node.getProperty("public")!.getType().getProperty("Tables")!;

  return tables
    .getTypeAtLocation(node)
    .getProperties()
    .map((property) => property.getName());
};

const run = async () => {
  log("Starting code generation");
  const types = await fetchTypes();

  await remove(directory);
  await ensureDir(`${directory}/hooks`);
  await writeFile(`${directory}/${types.fileName}`, types.content);

  const supabaseFile = await parseSupabaseFile();
  const tableNames = fetchTableNames(types);
  const hookFiles = await parseHookFiles(tableNames);

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
