import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import comment from "../../comment";
import { DIRECTORY, parseNameFormats } from "../../utils";
import { createResponseType, parseResponse } from "../utils/response";
import { createRequestType, parseRequest } from "../utils/request";
import {
  appendQueryParametersToURL,
  definitionParameters,
  hookParameters,
  parseHookName,
  parseURL,
} from "../utils";
import { HookMetadata } from "..";

export async function generatePostHook(
  pathName: string,
  containerApiUrl: string,
  responses: OpenAPIV3.ResponsesObject,
  requestBody?: OpenAPIV3.RequestBodyObject,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): Promise<HookMetadata> {
  const { pascalCase } = parseNameFormats(pathName);

  const url = parseURL(pathName, containerApiUrl);
  const hookName = parseHookName(pathName, "post");

  const responseTypeName = `${pascalCase}Response`;
  const [responseType, returnsResponse] = await createResponseType(
    responses,
    responseTypeName
  );

  const requestTypeName = `${pascalCase}Request`;
  const requestType = await createRequestType(requestTypeName, requestBody);

  const content = `
    ${comment}

    import { useState } from "react";

    ${requestType}
    ${responseType}

    function ${hookName}(${hookParameters(parameterObjects)}) {
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

      const execute = async (body: ${requestTypeName}): Promise<${responseTypeName}> => {
        setIsLoading(true)
        setIsError(false);

        const url = new URL(\`${url}\`);
        ${appendQueryParametersToURL(parameterObjects)}

        try {
          ${returnsResponse ? "const response = " : ""}await fetch(
            url.toString(),
            {
              headers: headers(),
              method: "POST",
              body: JSON.stringify(body)
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

  console.log(formattedContent);

  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);

  return buildMetadata(hookName, responses, requestBody, parameterObjects);
}

function buildMetadata(
  hookName: string,
  responses: OpenAPIV3.ResponsesObject,
  requestBody?: OpenAPIV3.RequestBodyObject,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): HookMetadata {
  const definition = `const { data, isError, isLoading } = ${hookName}(${definitionParameters(
    parameterObjects
  )});`;
  const importValue = `import ${hookName} from "@/backengine/hooks/${hookName}";`;
  const response = parseResponse(responses);
  const request = parseRequest(requestBody);

  return {
    hookName,
    definition,
    import: importValue,
    parameters: parameterObjects,
    response,
    request,
  };
}
