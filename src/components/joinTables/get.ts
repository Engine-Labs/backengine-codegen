import prettier from "prettier";
import comment from "../../comment";
import { TablesResponse } from "../../pgMeta/fetchTables";
import type { File, HookFile } from "../../types";
import { parseFetchFunctionNamesForJoinTable } from "./utils";

export const mapHookFileToGetComponent = async (
  hookFile: HookFile,
  joinTables: TablesResponse
): Promise<File> => {
  const {
    entityName,
    file: { fileName },
  } = hookFile;

  const componentName = `${fileName.replace("use", "")}`;

  const { tableOneFetchFunctionName, tableTwoFetchFunctionName } =
    parseFetchFunctionNamesForJoinTable(joinTables, entityName);

  const content = `
      ${comment}
  
      import { useState } from "react";
      import type { TableOneRow, TableTwoRow } from "../../hooks/${fileName}";
  
      export default function Get${componentName}({ 
        ${tableOneFetchFunctionName}, 
        ${tableTwoFetchFunctionName} 
      }: 
      { 
        ${tableOneFetchFunctionName}: (id: TableOneRow["id"]) => Promise<TableTwoRow[]>, 
        ${tableTwoFetchFunctionName}: (id: TableTwoRow["id"]) => Promise<TableOneRow[]> 
      }) {
        const [id, setId] = useState("");
        const [data, setData] = useState<TableOneRow[] | TableTwoRow[]>();

        return (
          <div
            style={{
              paddingTop: "20px",
            }}
          >
            <pre
              className="border rounded-md text-xs"
              style={{
                marginTop: "4px",
                padding: "16px",
                height: "200px",
                overflowY: "auto",
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
            <div 
              className="flex items-center"
              style={{
                marginTop: "10px",
              }}
            >
              <label 
                htmlFor="ID"
                style={{
                  flexBasis: "120px",
                }}
              >
                ID
              </label>
              <input
                type="text"
                id="ID"
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "1px solid #34383A",
                  marginLeft: "10px",
                  flex: "1",
                  borderRadius: "0.375rem",
                  padding: "4px 16px",
                }}
                value={id}
                onChange={(event) => setId(event.target.value)}
              />
            </div>
            <div style={{
              display: "flex",
              marginTop: "10px",
            }}>
              <button
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "8px 10px",
                  width: "200px",
                  borderRadius: "0.375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "20px",
                }}
                onClick={() => ${tableOneFetchFunctionName}(id as any).then((data) => setData(data))}
              >
                <div style={{ marginRight: "10px" }}>Run ${tableOneFetchFunctionName}</div>
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
              <button
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "8px 10px",
                  width: "200px",
                  borderRadius: "0.375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => ${tableTwoFetchFunctionName}(id as any).then((data) => setData(data))}
              >
                <div style={{ marginRight: "10px" }}>Run ${tableTwoFetchFunctionName}</div>
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
            </div>
          </div>
        )
      };
    `;

  const formattedContent = await prettier.format(content, {
    parser: "typescript",
  });

  return {
    fileName: `Get${componentName}.tsx`,
    content: formattedContent,
  };
};
