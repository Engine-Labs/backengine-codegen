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

export const fetchTypes = async (): Promise<File> => {
  // TODO: use proxy
  const typesResponse = await axios.get<string>(
    "http://0.0.0.0:1337/generators/typescript"
  );
  log("Fetched types metadata");

  const formattedContent = await prettier.format(typesResponse.data, {
    parser: "typescript",
  });

  return {
    content: formattedContent,
    fileName: "types.ts",
  };
};
