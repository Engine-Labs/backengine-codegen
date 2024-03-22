import { writeFile } from "fs-extra";
import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY, parseNameFormats } from "../utils";

export async function generatePostHook(
  pathName: string,
  containerApiUrl: string
) {
  const { pascalCase } = parseNameFormats(pathName);

  const hookName = `use${pascalCase.replace("Api", "")}Mutation`;
  const content = `
    ${comment}

    import { paths } from "../schema";

    type ${pascalCase}Body = paths["${pathName}"]["post"]["requestBody"]["content"]["application/json"];
    type ${pascalCase}Response = paths["${pathName}"]["post"]["responses"]["200"]["content"]["application/json"];

    function ${hookName}(body: ${pascalCase}Body) {

      const fetchData = async (): Promise<${pascalCase}Response> => {
        const response = await fetch("${containerApiUrl}${pathName}", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
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

  // console.log(formattedContent);
  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);
}
