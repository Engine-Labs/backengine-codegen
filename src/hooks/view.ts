import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { DIRECTORY, log, parseNameFormats } from "../utils";
import axios from "axios";

export type ColumnResponse = {
  tableId: number;
  schema: string;
  table: string;
  id: string;
  ordinalPosition: number;
  name: string;
  defaultValue: unknown;
  dataType: string;
  format: string;
  isIdentity: boolean;
  identityGeneration: "ALWAYS" | "BY DEFAULT" | null;
  isGenerated: boolean;
  isNullable: boolean;
  isUpdatable: boolean;
  isUnique: boolean;
  enums: string[];
  check: string | null;
  comment: string | null;
};

export type ViewResponse = {
  id: number;
  schema: string;
  name: string;
  isUpdatable: boolean;
  comment: string | null;
  columns?: ColumnResponse[];
};

export type ViewsResponse = ViewResponse[];

const parseViewNames = async (): Promise<string[]> => {
  const response = await axios.get<ViewsResponse>(
    `${process.env.BACKENGINE_BASE_URL}/api/v1/projects/${process.env.BACKENGINE_PROJECT_ID}/pg-meta/views`,
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
  const { pascalCasePlural, camelCasePlural } = parseNameFormats(viewName);

  const content = `
      ${comment}

      import { useState, useEffect } from "react";
      import { supabase } from "../supabase";
      import { Database } from "../types";

      type View = Database["public"]["Views"]["${viewName}"]
      export type Row = View["Row"];

      const use${pascalCasePlural} = () => {
        const [${camelCasePlural}, set${pascalCasePlural}] = useState<Row[]>([]);

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

        return { ${camelCasePlural}, fetch${pascalCasePlural} };
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
    entityType: "VIEW",
    entityName: viewName,
    usage,
  };
};

export const parseViewFiles = async (): Promise<HookFile[]> => {
  const viewNames = await parseViewNames();
  const hookPromises = viewNames.map<Promise<HookFile>>(mapViewToFile);
  const files = await Promise.all(hookPromises);
  return files;
};
