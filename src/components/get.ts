import prettier from "prettier";
import comment from "../comment";
import type { File, HookFile } from "../types";
import { parseNameFormats } from "../utils";

export const mapHookFileToGetComponent = async (
  hookFile: HookFile
): Promise<File> => {
  const {
    file: { fileName },
  } = hookFile;

  const componentName = `${fileName.replace("use", "")}`;
  const { camelCasePlural } = parseNameFormats(componentName);

  const content = `
      ${comment}
  
      import type { Row } from "../hooks/${fileName}";
  
      export default function Get${componentName}({ ${camelCasePlural}, onFetch }: { ${camelCasePlural}: Row[], onFetch: () => Promise<void> }) {
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
            <button
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
              onClick={onFetch}
            >
              <div style={{ marginRight: "10px" }}>Run GET</div>
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
