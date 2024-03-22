import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY, parseNameFormats } from "../utils";
import { writeFile } from "fs-extra";

export async function generateGetHook(
  pathName: string,
  containerApiUrl: string
) {
  const { pascalCase } = parseNameFormats(pathName);

  const hookName = `use${pascalCase.replace("Api", "")}Query`;
  const content = `
    ${comment}

    function ${hookName}() {

      const fetchData = async () => {
        const response = await fetch("${containerApiUrl}${pathName}");
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
