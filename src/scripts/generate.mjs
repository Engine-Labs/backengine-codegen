/* eslint-disable no-console */
import openapiTS from "openapi-typescript";
import fs from "fs";

const srcDir = `${process.cwd()}/src`;
const generatedDir = `${srcDir}/__generated__`;

async function generate() {
  fs.rmSync(generatedDir, { recursive: true, force: true });
  fs.mkdirSync(generatedDir);

  const result = await openapiTS(`${srcDir}/scripts/openapi.json`);
  fs.writeFileSync(`${generatedDir}/types.ts`, result, "utf8");
  console.log(`Generated TS types from OpenAPI 🚀`);
}

generate().catch(console.error);
