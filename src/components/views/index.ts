import prettier from "prettier";
import comment from "../../comment";
import type { File, HookFile } from "../../types";
import { parseNameFormats } from "../../utils";
import { mapHookFileToGetComponent } from "./get";

export const mapHookFileToComponent = async (
  hookFile: HookFile
): Promise<File> => {
  const {
    file: { fileName },
  } = hookFile;

  const componentName = fileName.replace("use", "");
  const getComponentName = `Get${componentName}`;
  const { camelCasePlural, pascalCasePlural } = parseNameFormats(componentName);

  const content = `
      ${comment}
  
      "use client";
  
      import ${fileName} from "../../hooks/${fileName}";
      import ${getComponentName} from "./${getComponentName}";
  
      export default function ${componentName}() {
        const { ${camelCasePlural}, fetch${pascalCasePlural} } = ${fileName}();
  
        return (
          <div>
            <${getComponentName} ${camelCasePlural}={${camelCasePlural}} onFetch={fetch${pascalCasePlural}} />
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

export const parseComponentFilesForViews = async (
  hookFiles: HookFile[]
): Promise<File[]> => {
  const viewHookFiles = hookFiles.filter(
    (hookFile) => hookFile.entityType === "VIEW"
  );

  const componentPromises = viewHookFiles.map(mapHookFileToComponent);
  const getComponentPromises = viewHookFiles.map(mapHookFileToGetComponent);

  const files = await Promise.all([
    ...componentPromises,
    ...getComponentPromises,
  ]);
  return files;
};
