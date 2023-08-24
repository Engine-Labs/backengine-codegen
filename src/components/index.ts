import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { parseNameFormats } from "../utils";
import { mapHookFileToDeleteComponent } from "./delete";
import { mapHookFileToGetComponent } from "./get";

export const mapHookFileToComponent = async (
  hookFile: HookFile
): Promise<File> => {
  const {
    file: { fileName },
  } = hookFile;

  const componentName = fileName.replace("use", "");
  const getComponentName = `Get${componentName}`;
  const deleteComponentName = `Delete${componentName}`;
  const { camelCasePlural, pascalCase, pascalCasePlural } =
    parseNameFormats(componentName);

  const content = `
      ${comment}
  
      "use client";
  
      import ${fileName} from "../hooks/${fileName}";
      import ${getComponentName} from "./${getComponentName}";
      import ${deleteComponentName} from "./${deleteComponentName}";
  
      export default function ${componentName}() {
        const { ${camelCasePlural}, fetch${pascalCasePlural}, delete${pascalCase} } = ${fileName}();
  
        return (
          <div>
            <${getComponentName} ${camelCasePlural}={${camelCasePlural}} onFetch={fetch${pascalCasePlural}} />
            <${deleteComponentName} onDelete={delete${pascalCase}} onFetch={fetch${pascalCasePlural}} />
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
  const tableHookFiles = hookFiles.filter(
    (hookFile) => hookFile.entityType === "TABLE"
  );

  const componentPromises = tableHookFiles.map(mapHookFileToComponent);
  const getComponentPromises = tableHookFiles.map(mapHookFileToGetComponent);
  const deleteComponentPromises = tableHookFiles.map(
    mapHookFileToDeleteComponent
  );

  const files = await Promise.all([
    ...componentPromises,
    ...getComponentPromises,
    ...deleteComponentPromises,
  ]);
  return files;
};
