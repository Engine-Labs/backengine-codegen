import { OpenAPIV3 } from "openapi-types";

type File = {
  fileName: string;
  content: string;
};

export type HookFile = {
  file: File;
  location: string;
  type: "HOOK";
  entityType: "TABLE" | "JOIN_TABLE" | "VIEW";
  entityName: string;
  usage: string;
};

export type HookMetadata = {
  hookName: string;
  definition: string;
  import: string;
  parameters?: OpenAPIV3.ParameterObject[];
};
