import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject, parseNameFormats } from "../utils";

export function parseHookName(pathName: string, method: string) {
  const { pascalCase } = parseNameFormats(pathName);
  if (method === "get") {
    return `use${pascalCase.replace("Api", "")}Query`;
  }
  return `use${pascalCase.replace("Api", "")}Mutation`;
}

export function parseURL(pathName: string, containerApiUrl: string) {
  return `${containerApiUrl}${pathName}`.replaceAll("{", "${");
}

export function appendQueryParametersToURL(
  parameters?: OpenAPIV3.ParameterObject[]
) {
  if (!parameters) {
    return "";
  }

  return parameters
    .filter((param) => param.in === "query")
    .map((param) => {
      return `if (${param.name} !== undefined) {
        url.searchParams.set("${param.name}", ${param.name});
      }`;
    })
    .join("\n\n");
}

export function callbackDependencies(parameters?: OpenAPIV3.ParameterObject[]) {
  if (!parameters) {
    return "";
  }

  return parameters.map((param) => param.name).join(", ");
}

export function hookParameters(parameters?: OpenAPIV3.ParameterObject[]) {
  if (!parameters) {
    return "";
  }

  return parameters
    .map((param) => {
      let type = (param.schema as OpenAPIV3.SchemaObject)?.type ?? "string";
      if (type === "integer") {
        return `${param.name}${param.required ? "" : "?"}: number`;
      }
      return `${param.name}${param.required ? "" : "?"}: ${type}`;
    })
    .join(", ");
}

export function definitionParameters(parameters?: OpenAPIV3.ParameterObject[]) {
  if (!parameters) {
    return "";
  }

  // TODO: query parameters
  return parameters
    .map((param) => {
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type;
      if (type === "integer") {
        return 10;
      }
      if (type === "boolean") {
        return false;
      }
      return `"${param.name}"`;
    })
    .join(", ");
}
