import { OpenAPIV3 } from "openapi-types";

export async function generatePostHook(
  pathName: string,
  containerApiUrl: string,
  parameterObjects?: OpenAPIV3.ParameterObject[],
  requestBody?: OpenAPIV3.RequestBodyObject
): Promise<void> {
  // const { pascalCase } = parseNameFormats(pathName);
  // const url = buildUrl(pathName, containerApiUrl);
  // const parameters = buildParameters(parameterObjects);
  // const hookName = buildHookName(pathName, "post");
  // // TODO: response type when not a 200 code
  // const content = `
  //   ${comment}
  //   import { paths } from "../schema";
  //   type ${pascalCase}Body = paths["${pathName}"]["post"]["requestBody"]["content"]["application/json"];
  //   type ${pascalCase}Response = paths["${pathName}"]["post"]["responses"]["200"]["content"]["application/json"];
  //   function ${hookName}(body: ${pascalCase}Body) {
  //     const execute = async (${parameters}): Promise<${pascalCase}Response> => {
  //       const response = await fetch(\`${url}\`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(body)
  //       });
  //       return response.json();
  //     }
  //     return {
  //       execute
  //     }
  //   }
  //   export default ${hookName};
  // `;
  // const formattedContent = await prettier.format(content, {
  //   parser: "typescript",
  // });
  // // console.log(formattedContent);
  // await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);
  // return {
  //   hookName,
  //   usage: `const { execute } = ${hookName}();`,
  //   parameters: parameterObjects,
  //   requestBody: requestBody?.content["application/json"]
  //     .schema as SchemaObject,
  // };
}
