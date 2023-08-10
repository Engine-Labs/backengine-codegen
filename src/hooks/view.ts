import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { DIRECTORY, log, parseNameFormats } from "../utils";
import axios from "axios";
import type { paths } from "../__generated__/types";

export type ViewsResponse =
  paths["/views/"]["get"]["responses"]["200"]["content"]["application/json"];

const parseViewNames = async (): Promise<string[]> => {
  const response = await axios.get<ViewsResponse>(
    `${process.env.BACKENGINE_BASE_URL}/api/v1/projects/${process.env.BACKENGINE_PROJECT_ID}/pg-meta/tables`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BACKENGINE_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  log("Fetched view metadata");

  const publicViews = response.data.filter((view) => view.schema === "public");

  return publicViews.map((view) => view.name);
};

const mapViewToFile = async (viewName: string): Promise<HookFile> => {
  const { pascalCase, pascalCasePlural, camelCasePlural } =
    parseNameFormats(viewName);

  const content = `
      ${comment}

      import { useState, useEffect } from "react";
      import { supabase } from "../supabase";
      import { Database } from "../types";

      type View = Database["public"]["Views"]["${viewName}"]
      type ${pascalCase} = View["Row"];

      const use${pascalCasePlural} = () => {
        const [${camelCasePlural}, set${pascalCasePlural}] = useState<${pascalCase}[]>([]);

        useEffect(() => {
          fetch${pascalCasePlural}();
        }, []);

        const fetch${pascalCasePlural} = async() => {
            try {
              const { data, error } = await supabase
                .from("${viewName}")
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

export const parseViewFiles = async (): Promise<HookFile[]> => {
  const viewNames = await parseViewNames();
  const hookPromises = viewNames.map<Promise<HookFile>>(mapViewToFile);
  const files = await Promise.all(hookPromises);
  return files;
};
