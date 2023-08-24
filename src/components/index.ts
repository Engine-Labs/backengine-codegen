import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
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
          <div></div>
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

const mapHookFileToDeleteComponent = async (
  hookFile: HookFile
): Promise<File> => {
  const {
    file: { fileName },
  } = hookFile;

  const componentName = fileName.replace("use", "");
  const { pascalCase, pascalCasePlural } = parseNameFormats(componentName);

  const content = `
    ${comment}

    "use client";

    import { FormEventHandler, MouseEventHandler, useState } from "react";
    import ${fileName} from "../hooks/${fileName}";

    export default function Delete${componentName}() {
      const { delete${pascalCase} } = use${pascalCasePlural}();
      const [message, setMessage] = useState<string>()

      const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
          id: { value: string };
        };
        delete${pascalCase}(target.id.value as any).then((count) => {
          if (count === 1) {
            setMessage("row deleted!");
          } else {
            setMessage("failed to delete row!");
          }
        });
      };

      const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
        setMessage(undefined);
      }

      if (message) {
        return <div style={{ display: "flex", flexDirection: "column", height: "98px", justifyContent: "end" }}>
          {message}
          <button 
            style={{
              background: "#fff",
              color: "#000",
              marginTop: "20px",
              padding: "4px 10px",
              width: "200px",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleClick}
          >
            Go Back
          </button>
        </div>
      }

      return (
        <div
          style={{
            paddingTop: "20px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <div className="flex">
              <label htmlFor="id">ID:</label>
              <input
                type="text"
                id="id"
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "1px solid #fff",
                  marginLeft: "10px",
                  flex: "1",
                  borderRadius: "0.375rem",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: "#fff",
                color: "#000",
                marginTop: "20px",
                padding: "4px 10px",
                width: "200px",
                borderRadius: "0.375rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ marginRight: "10px" }}>Run DELETE</div>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{
                  height: "20px",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            </button>
          </form>
        </div>
      );
    }    
  `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  return {
    fileName: `Delete${componentName}.tsx`,
    content: formattedContent,
  };
};

export const parseComponentFiles = async (
  hookFiles: HookFile[]
): Promise<File[]> => {
  // const { tables } = await fetchTables();

  const componentPromises = hookFiles.map(mapHookFileToComponent);
  const deleteComponentPromises = hookFiles
    .filter((hookFile) => hookFile.entityType === "TABLE")
    .map(mapHookFileToDeleteComponent);
  const files = await Promise.all([
    ...componentPromises,
    ...deleteComponentPromises,
  ]);

  return files;
};
