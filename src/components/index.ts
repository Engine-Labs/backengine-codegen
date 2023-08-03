import comment from "../comment";
import type { File, HookFile } from "../types";
import prettier from "prettier";
import { parseNameFormats } from "../utils";

const mapHookFileToComponent = async (hookFile: HookFile): Promise<File> => {
  const {
    file: { fileName },
  } = hookFile;

  const componentName = fileName.replace("use", "");
  const { camelCasePlural } = parseNameFormats(componentName);

  const content = `
    ${comment}

    "use client";

    import ${fileName} from "../hooks/${fileName}";

    export default function ${componentName}() {
      const { ${camelCasePlural} } = ${fileName}();

      return (
        <div
          style={{
            paddingTop: "20px",
          }}
        >
          <code>${camelCasePlural}</code>
          <pre
            className="border rounded-md text-xs"
            style={{
              marginTop: "4px",
              padding: "16px",
              height: "200px",
              overflowY: "auto",
            }}
          >
            {JSON.stringify(${camelCasePlural}, null, 2)}
          </pre>
        </div>
      )
    };
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  return {
    fileName: `${componentName}.tsx`,
    content: formattedContent,
  };
};

export const parseComponentFiles = async (
  hookFiles: HookFile[]
): Promise<File[]> => {
  const componentPromises = hookFiles.map(mapHookFileToComponent);
  const files = await Promise.all(componentPromises);
  return files;
};
