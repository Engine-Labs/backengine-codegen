import { OpenAPIV3 } from "openapi-types";
import { parseNameFormats } from "../utils";

export function buildHookName(pathName: string, method?: string) {
  const { pascalCase } = parseNameFormats(pathName);
  if (method === "post") {
    return `use${pascalCase.replace("Api", "")}Mutation`;
  }
  return `use${pascalCase.replace("Api", "")}Query`;
}

export function buildUrl(pathName: string, containerApiUrl: string) {
  return `${containerApiUrl}${pathName}`.replaceAll("{", "${");
}

export function buildParameters(parameters?: OpenAPIV3.ParameterObject[]) {
  if (!parameters) {
    return "";
  }

  // TODO: query parameters
  return parameters
    .filter((param) => param.in === "path")
    .map((param) => {
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type ?? "string";
      return `${param.name}${param.required ? "" : "?"}: ${type}`;
    })
    .join(", ");
}
