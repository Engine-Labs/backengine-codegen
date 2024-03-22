import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY } from "../utils";
import { buildHookName, buildParameters, buildUrl } from "./utils";

export async function generateGetHook(
  pathName: string,
  containerApiUrl: string,
  parameterObjects?: OpenAPIV3.ParameterObject[]
) {
  const url = buildUrl(pathName, containerApiUrl);
  const parameters = buildParameters(parameterObjects);
  const hookName = buildHookName(pathName);

  const content = `
    ${comment}

    function ${hookName}() {

      const fetchData = async (${parameters}) => {
        const response = await fetch(\`${url}\`);
        return response.json();
      }

      return {
        fetchData
      }
    }

    export default ${hookName};
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  // if (hookName === "usePetFindByTagQuery") {
  console.log(formattedContent);
  // }
  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);
}
