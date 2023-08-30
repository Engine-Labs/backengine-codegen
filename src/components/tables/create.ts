import prettier from "prettier";
import comment from "../../comment";
import type { ColumnResponse, TablesResponse } from "../../pgMeta/fetchTables";
import type { File, HookFile } from "../../types";
import { parseNameFormats } from "../../utils";

const mapColumns = (
  columns?: ColumnResponse[]
): { fields: string; inputs: string } => {
  if (!columns) {
    return { fields: "", inputs: "" };
  }

  const filteredColumns = columns.filter((column) => !column.isIdentity);
  const fields = filteredColumns.map((column) => `"${column.name}"`).join(",");
  const inputs = filteredColumns
    .map((column, index) => {
      const label =
        !column.isNullable && !column.defaultValue
          ? `${column.name}*`
          : column.name;
      return `
        <div className="flex items-center">
          <label 
            htmlFor="${column.name}"
            style={{
              flexBasis: "200px",
              marginRight: "10px"
            }}
          >
            ${label}
          </label>
          <label 
            htmlFor="${column.name}"
            style={{
              flexBasis: "200px",
            }}
          >
            ${column.dataType}
          </label>
          <input
            type="text"
            id="${column.name}"
            style={{
              ${index > 0 ? 'marginTop: "10px",' : ""}
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
      `;
    })
    .join(" ");

  return { fields, inputs };
};

export const mapHookFileToCreateComponent = async (
  hookFile: HookFile,
  tables: TablesResponse
): Promise<File> => {
  const {
    entityName,
    file: { fileName },
  } = hookFile;

  const table = tables.find((table) => table.name === entityName);
  const componentName = `${fileName.replace("use", "")}`;
  const { pascalCase } = parseNameFormats(componentName);

  const { fields, inputs } = mapColumns(table?.columns);

  const content = `
      ${comment}

      "use client";
  
      import { FormEventHandler, MouseEventHandler, useState } from "react";
      import type { Row, Insert${pascalCase} } from "../../hooks/${fileName}";

      const fields: Array<keyof Insert${pascalCase}> = [${fields}]
  
      export default function Create${componentName}({ onCreate, onFetch }: { onCreate: (newRow: Insert${pascalCase}) => Promise<Row | undefined>, onFetch: () => Promise<void> }) {
        const [message, setMessage] = useState<string>();
  
        const handleSubmit: FormEventHandler = (event) => {
          event.preventDefault();
          const target = event.target as typeof event.target & Insert${pascalCase};
          const newRow = fields
            .map((field) => ({ field, value: (target[field] as any)?.value }))
            .reduce((newRow, { field,value }) => {
              if (value.trim() !== "") {
                newRow[field] = value;
              }
              return newRow;
            }, {} as Record<keyof Insert${pascalCase}, any>);
          onCreate(newRow)
            .then((task) => {
              if (task) {
                setMessage("row with id " + task.id + " created!");
                onFetch();
              } else {
                setMessage("failed to create row!");
              }
            })
            .catch((error) => {
              if (error.message) {
                setMessage(error.message);
              } else {
                setMessage("failed to create row!");
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
              ${inputs}
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
                <div style={{ marginRight: "10px" }}>Run POST</div>
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
    fileName: `Create${componentName}.tsx`,
    content: formattedContent,
  };
};
