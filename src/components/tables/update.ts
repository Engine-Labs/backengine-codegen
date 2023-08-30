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

  const filteredColumns = columns.filter(
    (column) => column.isIdentity || column.isUpdatable
  );
  const fields = filteredColumns
    .filter((column) => !column.isIdentity)
    .map((column) => `"${column.name}"`)
    .join(",");
  const inputs = filteredColumns
    .map((column, index) => {
      const label = column.isIdentity ? `${column.name}*` : column.name;
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

export const mapHookFileToUpdateComponent = async (
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
      import type { Row, Update${pascalCase} } from "../../hooks/${fileName}";

      const fields: Array<keyof Update${pascalCase}> = [${fields}]
  
      export default function Update${componentName}({ 
        onUpdate, 
        onFetch 
      }: { 
        onUpdate: (id: Row["id"], updatedRow: Update${pascalCase}) => Promise<Row | undefined>, 
        onFetch: () => Promise<void> 
      }) {
        const [message, setMessage] = useState<string>();
  
        const handleSubmit: FormEventHandler = (event) => {
          event.preventDefault();
          const target = event.target as typeof event.target & Update${pascalCase};
          const id = (target["id"] as any)?.value;
          const updatedRow = fields
            .map((field) => ({ field, value: (target[field] as any)?.value }))
            .reduce((newRow, { field,value }) => {
              if (value.trim() !== "") {
                newRow[field] = value;
              }
              return newRow;
            }, {} as Record<keyof Update${pascalCase}, any>);
          onUpdate(id, updatedRow)
            .then((task) => {
              if (task) {
                setMessage("row with id " + task.id + " updated!");
                onFetch();
              } else {
                setMessage("failed to update row!");
              }
            })
            .catch((error) => {
              if (error.message) {
                setMessage(error.message);
              } else {
                setMessage("failed to update row!");
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
                <div style={{ marginRight: "10px" }}>Run PUT</div>
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
    fileName: `Update${componentName}.tsx`,
    content: formattedContent,
  };
};
