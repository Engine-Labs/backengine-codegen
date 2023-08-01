import {
  camelCase as toCamelCase,
  pascalCase as toPascalCase,
} from "change-case-all";
import gradient from "gradient-string";
import { plural, singular } from "pluralize";

const backengineGradient = gradient(["#00CB8A", "#78E0B8"]);
const errorGradient = gradient(["#FF5733", "#FF5733"]);

export const log = (message: string) => {
  const messageWithGradient = backengineGradient(`[Backengine] ${message}`);
  console.log(messageWithGradient);
};

export const logError = (message: string, error: any) => {
  if (error instanceof Error) {
    const errorMessageWithGradient = errorGradient(
      `[Backengine] ${error.message}`
    );
    console.error(error);
    console.error(errorMessageWithGradient);
  } else {
    console.error(error);
  }
  const messageWithGradient = errorGradient(`[Backengine] ${message}`);
  console.error(messageWithGradient);
};

export const DIRECTORY = "__backengine__";

const sanitiseFormat = (format: string): string => {
  return format.replaceAll("_", "");
};

export const parseNameFormats = (
  name: string
): {
  pascalCase: string;
  pascalCasePlural: string;
  camelCase: string;
  camelCasePlural: string;
} => {
  return {
    pascalCase: sanitiseFormat(singular(toPascalCase(name))),
    pascalCasePlural: sanitiseFormat(plural(toPascalCase(name))),
    camelCase: sanitiseFormat(singular(toCamelCase(name))),
    camelCasePlural: sanitiseFormat(plural(toCamelCase(name))),
  };
};
