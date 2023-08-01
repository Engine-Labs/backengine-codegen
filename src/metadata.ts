import prettier from "prettier";
import type { File, HookFile } from "./types";

export const parseMetadataFile = async (
  hookFiles: HookFile[]
): Promise<File> => {
  const metadata = JSON.stringify(
    hookFiles.map((hookFile) => {
      return {
        name: hookFile.file.fileName,
        location: hookFile.location,
        type: hookFile.type,
        entity: hookFile.entity,
        usage: hookFile.usage,
      };
    })
  );

  const formattedContent = await prettier.format(metadata, {
    parser: "json",
  });

  return {
    content: formattedContent,
    fileName: "metadata.json",
  };
};
