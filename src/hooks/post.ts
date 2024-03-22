import { writeFile } from "fs-extra";
import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY, parseNameFormats } from "../utils";
import {
  HookMetadata,
  buildHookName,
  buildParameters,
  buildUrl,
} from "./utils";
import { OpenAPIV3 } from "openapi-types";
import { SchemaObject } from "openapi-typescript";

export async function generatePostHook(
  pathName: string,
  containerApiUrl: string,
  parameterObjects?: OpenAPIV3.ParameterObject[],
  requestBody?: OpenAPIV3.RequestBodyObject
): Promise<HookMetadata> {
  const { pascalCase } = parseNameFormats(pathName);

  const url = buildUrl(pathName, containerApiUrl);
  const parameters = buildParameters(parameterObjects);
  const hookName = buildHookName(pathName);

  const content = `
    ${comment}

    import { paths } from "../schema";

    type ${pascalCase}Body = paths["${pathName}"]["post"]["requestBody"]["content"]["application/json"];
    type ${pascalCase}Response = paths["${pathName}"]["post"]["responses"]["200"]["content"]["application/json"];

    function ${hookName}(body: ${pascalCase}Body) {

      const execute = async (${parameters}): Promise<${pascalCase}Response> => {
        const response = await fetch(\`${url}\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        return response.json();
      }

      return {
        execute
      }
    }

    export default ${hookName};
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  // console.log(formattedContent);
  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);

  return {
    hookName,
    usage: `const { execute } = ${hookName}();`,
    parameters: parameterObjects,
    requestBody: requestBody?.content["application/json"]
      .schema as SchemaObject,
  };
}
