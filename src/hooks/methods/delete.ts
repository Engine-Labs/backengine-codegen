import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import comment from "../../comment";
import { DIRECTORY, parseNameFormats } from "../../utils";
import { createResponseType, parseResponse } from "../utils/response";
import {
  appendQueryParametersToURL,
  definitionParameters,
  hookParameters,
  parseHookName,
  parseURL,
} from "../utils";
import { HookMetadata } from "..";

export async function generateDeleteHook(
  pathName: string,
  containerApiUrl: string,
  responses: OpenAPIV3.ResponsesObject,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): Promise<HookMetadata> {
  const { pascalCase } = parseNameFormats(pathName);

  const url = parseURL(pathName, containerApiUrl);
  const hookName = parseHookName(pathName, "delete");

  const responseTypeName = `${pascalCase}Response`;
  const [responseType, returnsResponse] = await createResponseType(
    responses,
    responseTypeName
  );

  const content = `
    ${comment}

    import { useState } from "react";

    ${responseType}

    function ${hookName}() {
      const [isError, setIsError] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const headers = (): HeadersInit => {
        const token = localStorage.getItem("engine-token");
        const defaultHeaders = { 
          "Content-Type": "application/json"
        }
        return token ? { 
          ...defaultHeaders,
          Authorization: \`Bearer \${token}\` 
        } : defaultHeaders;
      };

      const execute = async (${hookParameters(
        parameterObjects
      )}): Promise<${responseTypeName}> => {
        setIsLoading(true)
        setIsError(false);

        const url = new URL(\`${url}\`);
        ${appendQueryParametersToURL(parameterObjects)}

        try {
          ${returnsResponse ? "const response = " : ""}await fetch(
            url.toString(),
            {
              headers: headers(),
              method: "DELETE",
            }
          );
          ${returnsResponse ? "return await response.json();" : ""}
        } catch (error) {
          setIsError(true);
          throw error;
        } finally {
          setIsLoading(false);
        }
      };


      return {
        execute,
        isError,
        isLoading,
      }
    }

    export default ${hookName};
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  // console.log(formattedContent);

  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);

  return buildMetadata(hookName, responses, parameterObjects);
}

function buildMetadata(
  hookName: string,
  responses: OpenAPIV3.ResponsesObject,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): HookMetadata {
  const definition = `const { data, isError, isLoading } = ${hookName}(${definitionParameters(
    parameterObjects
  )});`;
  const importValue = `import ${hookName} from "@/backengine/hooks/${hookName}";`;
  const response = parseResponse(responses);

  return {
    hookName,
    definition,
    import: importValue,
    parameters: parameterObjects,
    response,
  };
}
