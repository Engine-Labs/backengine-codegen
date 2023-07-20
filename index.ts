import { ensureDir, remove, writeFile } from "fs-extra";
import { parseSupabaseFile } from "./src/supabase";
import { parseHookFiles } from "./src/hooks";

const IS_DEV = false;
// TODO: probably want an env variable here
const directory = IS_DEV ? "dev-src" : "src/__backengine__";

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

  console.log("Backengine code generation finished 🚀");
};

run();
