import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import { HookMetadata } from "..";
import comment from "../../comment";
import { DIRECTORY, parseNameFormats } from "../../utils";
import {
  appendQueryParametersToURL,
  callbackDependencies,
  definitionParameters,
  hookParameters,
  parseHookName,
  parseURL,
} from "../utils";
import { createResponseType, parseResponse } from "../utils/response";

export async function generateGetHook(
  pathName: string,
  containerApiUrl: string,
  responses: OpenAPIV3.ResponsesObject,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): Promise<HookMetadata> {
  const { pascalCase } = parseNameFormats(pathName);

  const url = parseURL(pathName, containerApiUrl);
  const hookName = parseHookName(pathName, "get");

  const responseTypeName = `${pascalCase}Response`;
  const [responseType] = await createResponseType(responses, responseTypeName);

  const content = `
    ${comment}

    import { useCallback, useEffect, useState } from "react";

    ${responseType}

    function ${hookName}(${hookParameters(parameterObjects)}) {
      const [isError, setIsError] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [data, setData] = useState<${responseTypeName}>();

      const headers = (): HeadersInit => {
        const token = localStorage.getItem("engine-token");
        return token ? { Authorization: \`Bearer \${token}\` } : {};
      };

      const fetchData = useCallback(async () => {
        const url = new URL(\`${url}\`);

        ${appendQueryParametersToURL(parameterObjects)}

        const response = await fetch(
          url.toString(),
          {
            headers: headers(),
          }
        );
        setData(await response.json());
      }, [${callbackDependencies(parameterObjects)}]);


      useEffect(() => {
        setIsLoading(true);
        fetchData()
          .catch(() => {
            setIsError(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, [fetchData]);

      return {
        data,
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
