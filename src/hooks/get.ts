import { writeFile } from "fs-extra";
import { OpenAPIV3 } from "openapi-types";
import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY } from "../utils";
import type { HookMetadata } from "./types";
import { buildHookName, buildParameters, buildUrl } from "./utils";

export async function generateGetHook(
  pathName: string,
  containerApiUrl: string,
  parameterObjects?: OpenAPIV3.ParameterObject[]
): Promise<HookMetadata> {
  const url = buildUrl(pathName, containerApiUrl);
  const parameters = buildParameters(parameterObjects);
  const hookName = buildHookName(pathName);

  const content = `
    ${comment}

    import { useCallback, useEffect, useState } from "react";

    function ${hookName}() {
      const [isError, setIsError] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [data, setData] = useState<unknown>();

      const headers = (): HeadersInit => {
        const token = localStorage.getItem("engine-token");
        return token ? { Authorization: \`Bearer \${token}\` } : {};
      };

      const fetchData = useCallback(async (${parameters}) => {
        const response = await fetch(
          \`${url}\`,
          {
            headers: headers(),
          }
        );
        setData(await response.json());
      }, []);


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

  await writeFile(`${DIRECTORY}/hooks/${hookName}.ts`, formattedContent);

  return {
    hookName,
    definition: `const { data, isError, isLoading } = ${hookName}();`,
    import: `import ${hookName} from "../../__backengine__/hooks/${hookName}";`,
    parameters: parameterObjects,
  };
}
