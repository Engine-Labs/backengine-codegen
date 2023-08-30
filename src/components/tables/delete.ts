import prettier from "prettier";
import comment from "../../comment";
import type { File, HookFile } from "../../types";
import { TablesResponse } from "../../pgMeta/fetchTables";

export const mapHookFileToDeleteComponent = async (
  hookFile: HookFile,
  tables: TablesResponse
): Promise<File> => {
  const {
    file: { fileName },
    entityName,
  } = hookFile;

  const table = tables.find((table) => table.name === entityName);
  const componentName = `${fileName.replace("use", "")}`;

  const primaryKeyColumn = table?.columns?.find(
    (column) => column.name === table?.primaryKeys.at(0)?.name
  );

  const content = `
      ${comment}

      "use client";
  
      import { FormEventHandler, MouseEventHandler, useState } from "react";
      import type { Row } from "../../hooks/${fileName}";
  
      export default function Delete${componentName}({ 
        onDelete, 
        onFetch
      }: { 
        onDelete: (id: Row["id"]) => Promise<number | null>, 
        onFetch: () => Promise<void> 
      }) {
        const [message, setMessage] = useState<string>();
  
        const handleSubmit: FormEventHandler = (event) => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            id: { value: string };
          };
          onDelete(target.id.value as any).then((count) => {
            if (count === 1) {
              setMessage("row deleted!");
              onFetch();
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
                padding: "8px 10px",
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
              <div className="flex items-center">
                <label 
                  htmlFor="id"
                  style={{
                    flexBasis: "200px",
                    marginRight: "10px"
                  }}
                >
                  ID
                </label>
                <label 
                  htmlFor="id"
                  style={{
                    flexBasis: "200px",
                  }}
                >
                  ${primaryKeyColumn?.dataType}
                </label>
                <input
                  type="text"
                  id="id"
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: "1px solid #34383A",
                    marginLeft: "10px",
                    flex: "1",
                    borderRadius: "0.375rem",
                    padding: "4px 16px",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "#fff",
                  color: "#000",
                  marginTop: "10px",
                  padding: "8px 10px",
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
