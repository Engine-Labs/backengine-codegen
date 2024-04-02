import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject, parseNameFormats } from "../../utils";

export function parseHookName(pathName: string, method: string) {
  const { pascalCaseRaw } = parseNameFormats(pathName);
  const hookName = pascalCaseRaw.replace("Api", "");
  switch (method) {
    case "get":
      return `use${hookName}Query`;
    case "delete":
      return `use${hookName}DeleteMutation`;
    case "put":
      return `use${hookName}PutMutation`;
    case "patch":
      return `use${hookName}PatchMutation`;
    default:
      return `use${hookName}PostMutation`;
  }
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
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type ?? "string";

      if (type === "array") {
        return `if (${param.name} !== undefined) {
          url.searchParams.set("${param.name}", ${param.name}.join(","));
        }`;
      }

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

  // TODO: handle optional parameters (should always be after required parameters)
  return parameters
    .map((param) => {
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type ?? "string";

      if (type === "integer") {
        return `${param.name}${param.required ? "" : "?"}: number`;
      }

      if (type === "array") {
        const items = (param.schema as OpenAPIV3.ArraySchemaObject)?.items;
        if (isReferenceObject(items) || !items.type) {
          return `${param.name}${param.required ? "" : "?"}: string[]`;
        }
        return `${param.name}${param.required ? "" : "?"}: ${items.type}[]`;
      }

      return `${param.name}${param.required ? "" : "?"}: ${type}`;
    })
    .join(", ");
}

export function definitionParameters(parameters?: OpenAPIV3.ParameterObject[]) {
  if (!parameters) {
    return "";
  }

  return parameters
    .map((param) => {
      const type = (param.schema as OpenAPIV3.SchemaObject)?.type;
      if (type === "integer") {
        return 10;
      }
      if (type === "boolean") {
        return false;
      }
      if (type === "array") {
        return "[]";
      }
      return `"${param.name}"`;
    })
    .join(", ");
}
