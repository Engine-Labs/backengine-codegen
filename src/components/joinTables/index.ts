import prettier from "prettier";
import comment from "../../comment";
import type { TablesResponse } from "../../pgMeta/fetchTables";
import type { File, HookFile } from "../../types";
import { mapHookFileToGetComponent } from "./get";
import { parseFetchFunctionNamesForJoinTable } from "./utils";

export const mapHookFileToComponent = async (
  hookFile: HookFile,
  joinTables: TablesResponse
): Promise<File> => {
  const {
    entityName,
    file: { fileName },
  } = hookFile;

  const componentName = fileName.replace("use", "");
  const getComponentName = `Get${componentName}`;

  const { tableOneFetchFunctionName, tableTwoFetchFunctionName } =
    parseFetchFunctionNamesForJoinTable(joinTables, entityName);

  const content = `
      ${comment}
  
      "use client";
  
      import ${fileName} from "../../hooks/${fileName}";
      import ${getComponentName} from "./${getComponentName}";
  
      export default function ${componentName}() {
        const { ${tableOneFetchFunctionName}, ${tableTwoFetchFunctionName} } = ${fileName}();
  
        return (
          <div>
            <${getComponentName} ${tableOneFetchFunctionName}={${tableOneFetchFunctionName}} ${tableTwoFetchFunctionName}={${tableTwoFetchFunctionName}} />
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

export const parseComponentFilesForJoinTables = async (
  hookFiles: HookFile[],
  joinTables: TablesResponse
): Promise<File[]> => {
  const joinTableHookFiles = hookFiles.filter(
    (hookFile) => hookFile.entityType === "JOIN_TABLE"
  );

  const componentPromises = joinTableHookFiles.map((joinTableHookFile) =>
    mapHookFileToComponent(joinTableHookFile, joinTables)
  );
  const getComponentPromises = joinTableHookFiles.map((joinTableHookFile) =>
    mapHookFileToGetComponent(joinTableHookFile, joinTables)
  );

  const files = await Promise.all([
    ...componentPromises,
    ...getComponentPromises,
  ]);
  return files;
};
