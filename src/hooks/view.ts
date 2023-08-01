import prettier from "prettier";
import { Project } from "ts-morph";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { DIRECTORY, parseNameFormats } from "../utils";

const parseViewNames = (types: File): string[] => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `${DIRECTORY}/${types.fileName}`
  );

  const node = sourceFile.getInterface("Database")!;
  const tables = node.getProperty("public")!.getType().getProperty("Views")!;

  return tables
    .getTypeAtLocation(node)
    .getProperties()
    .map((property) => property.getName());
};

const mapViewToFile = async (tableName: string): Promise<HookFile> => {
  const { pascalCase, pascalCasePlural, camelCasePlural } =
    parseNameFormats(tableName);

  const content = `
      ${comment}
  
      import { useState, useEffect } from "react";
      import { supabase } from "../supabase";
      import { Database } from "../types";
  
      type View = Database["public"]["Views"]["${tableName}"]
      type ${pascalCase} = View["Row"];
  
      const use${pascalCasePlural} = () => {
        const [${camelCasePlural}, set${pascalCasePlural}] = useState<${pascalCase}[]>([]);
  
        useEffect(() => {
          fetch${pascalCasePlural}();
        }, []);
  
        const fetch${pascalCasePlural} = async() => {
            try {
              const { data, error } = await supabase
                .from("${tableName}")
                .select();
              if (error) {
                throw error;
              }
              set${pascalCasePlural}(data || []);
            } catch (error) {
              console.error("Error fetching", error);
            }
        };
  
        return { ${camelCasePlural} };
      };
  
      export default use${pascalCasePlural};
    `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  const file: File = {
    fileName: `use${pascalCasePlural}`,
    content: formattedContent,
  };
  const usage = `const { ${camelCasePlural} } = use${pascalCasePlural}();`;

  return {
    file,
    location: `${DIRECTORY}/hooks/${file.fileName}.ts`,
    type: "HOOK",
    entity: "VIEW",
    usage,
  };
};

export const parseViewFiles = async (types: File): Promise<HookFile[]> => {
  const viewNames = parseViewNames(types);
  const hookPromises = viewNames.map<Promise<HookFile>>(mapViewToFile);
  const files = await Promise.all(hookPromises);
  return files;
};
