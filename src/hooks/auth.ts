import { writeFile } from "fs-extra";
import prettier from "prettier";
import comment from "../comment";
import { DIRECTORY } from "../utils";
import { parseURL } from "./utils";
import type { HookMetadata } from "./types";

export async function generateLoginHook(
  containerApiUrl: string
): Promise<HookMetadata> {
  const pathName = "/api/login";

  const url = parseURL(pathName, containerApiUrl);

  const content = `
    ${comment}

    function useLoginMutation() {

      const login = async (email: string, password: string): Promise<void> => {
        const response = await fetch(\`${url}\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });
        const json = await response.json();
        if (json.accessToken) {
          localStorage.setItem("engine-token", json.accessToken);
        }
      }

      return {
        login
      }
    }

    export default useLoginMutation;
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  await writeFile(`${DIRECTORY}/hooks/useLoginMutation.ts`, formattedContent);

  const hookName = "useLoginMutation";
  return {
    hookName,
    definition: `const { data, isError, isLoading } = ${hookName}();`,
    import: `import ${hookName} from "@/__backengine__/hooks/${hookName}";`,
  };
}
