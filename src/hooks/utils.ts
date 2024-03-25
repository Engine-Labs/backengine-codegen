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

export function buildParameters(
  withType: boolean,
  parameters?: OpenAPIV3.ParameterObject[]
) {
  if (!parameters) {
    return "";
  }

  // TODO: query parameters
  return parameters
    .filter((param) => param.in === "path")
    .map((param) => {
      if (!withType) {
        return param.name;
      }
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type ?? "string";
      return `${param.name}${param.required ? "" : "?"}: ${type}`;
    })
    .join(", ");
}

export function buildExampleParameters(
  parameters?: OpenAPIV3.ParameterObject[]
) {
  if (!parameters) {
    return "";
  }

  // TODO: query parameters
  return parameters
    .filter((param) => param.in === "path")
    .map((param) => {
      // TODO: handle other types
      const value =
        (param.schema as OpenAPIV3.SchemaObject)?.type === "string"
          ? `"${param.name}"`
          : 10;
      return value;
    })
    .join(", ");
}
