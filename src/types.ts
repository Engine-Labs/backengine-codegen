import axios from "axios";
import prettier from "prettier";
import { log } from "./log";
import type { paths } from "./__generated__/types";

export type TablesResponse =
  paths["/tables/"]["get"]["responses"]["200"]["content"]["application/json"];

export type File = {
  fileName: string;
  content: string;
};

export type TypesResponse = {
  types: string;
};

export const fetchTypes = async (): Promise<File> => {
  const typesResponse = await axios.get<TypesResponse>(
    `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_ID}/types/typescript`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_MANAGEMENT_API_ACCESS_TOKEN}`,
      },
    }
  );
  log("Fetched types metadata");

  const formattedContent = await prettier.format(typesResponse.data.types, {
    parser: "typescript",
  });

  return {
    content: formattedContent,
    fileName: "types.ts",
  };
};
