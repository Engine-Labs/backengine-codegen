import axios from "axios";
import prettier from "prettier";
import comment from "./comment";
import { log } from "./utils";

export type File = {
  fileName: string;
  content: string;
};

export type HookFile = {
  file: File;
  location: string;
  type: "HOOK";
  entity: "TABLE" | "VIEW";
  usage: string;
};

export type TypesResponse = {
  types: string;
};

export const fetchTypes = async (): Promise<File> => {
  if (!process.env.BACKENGINE_BASE_URL)
    throw Error("BACKENGINE_BASE_URL must be supplied");
  if (!process.env.BACKENGINE_PROJECT_ID)
    throw Error("BACKENGINE_PROJECT_ID must be supplied");
  if (!process.env.BACKENGINE_API_KEY)
    throw Error("BACKENGINE_API_KEY must be supplied");

  const typesResponse = await axios.get(
    `${process.env.BACKENGINE_BASE_URL}/api/v1/projects/${process.env.BACKENGINE_PROJECT_ID}/pg-meta/generators/typescript`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BACKENGINE_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  log("Fetched types metadata");

  const types = `
    ${comment}

    ${typesResponse.data}
  `;

  const formattedContent = await prettier.format(types, {
    parser: "typescript",
  });

  return {
    content: formattedContent,
    fileName: "types.ts",
  };
};
