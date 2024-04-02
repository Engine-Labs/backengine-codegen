import {
  camelCase as toCamelCase,
  pascalCase as toPascalCase,
} from "change-case-all";
import gradient from "gradient-string";
import { OpenAPIV3 } from "openapi-types";
import { plural, singular } from "pluralize";

const backengineGradient = gradient(["#00CB8A", "#78E0B8"]);
const errorGradient = gradient(["#FF5733", "#FF5733"]);

export const log = (message: string) => {
  const messageWithGradient = backengineGradient(`[Backengine] ${message}`);
  console.log(messageWithGradient);
};

export const logError = (message: string, error: any) => {
  const messageWithGradient = errorGradient(`[Backengine] ${message}`);
  console.error(messageWithGradient);
  console.error(error);
};

export const DIRECTORY = "__backengine__";

const sanitiseFormat = (format: string): string => {
  return format.replaceAll("_", "");
};

export const parseNameFormats = (
  name: string
): {
  name: string;
  pascalCaseRaw: string;
  pascalCase: string;
  pascalCasePlural: string;
  camelCase: string;
  camelCasePlural: string;
} => {
  return {
    name,
    pascalCaseRaw: sanitiseFormat(toPascalCase(name)),
    pascalCase: sanitiseFormat(singular(toPascalCase(name))),
    pascalCasePlural: sanitiseFormat(plural(toPascalCase(name))),
    camelCase: sanitiseFormat(singular(toCamelCase(name))),
    camelCasePlural: sanitiseFormat(plural(toCamelCase(name))),
  };
};

export function isReferenceObject(
  param: any
): param is OpenAPIV3.ReferenceObject {
  return typeof param === "object" && "$ref" in param;
}
