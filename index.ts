#!/usr/bin/env node
import "dotenv/config";
import axios from "axios";
import { OpenAPIV3 } from "openapi-types";
import { version } from "./package.json";
import SwaggerParser from "@apidevtools/swagger-parser";
import { ensureDir, remove, writeFile } from "fs-extra";
import { DIRECTORY, log, logError } from "./src/utils";
import { parseHookFiles } from "./src/hooks";
import openapiTS, { astToString } from "openapi-typescript";

const isPetstore = true;

const run = async () => {
  log(`Starting code generation (v${version})`);

  const url = isPetstore
    ? "https://petstore3.swagger.io/api/v3/openapi.json"
    : `https://backengine-staging-446e.fly.dev`;

  const ast = isPetstore
    ? await openapiTS(new URL(`${url}`))
    : await openapiTS(new URL(`${url}/api/docs/json`));
  const contents = astToString(ast);

  const response = isPetstore
    ? await axios.get(`${url}`)
    : await axios.get(`${url}/api/docs/json`);
  const openApiDoc = (await SwaggerParser.dereference(
    response.data
  )) as OpenAPIV3.Document;

  await remove(DIRECTORY);
  await ensureDir(DIRECTORY);
  await writeFile(`${DIRECTORY}/schema.ts`, contents);
  await ensureDir(`${DIRECTORY}/hooks`);

  await parseHookFiles(url, openApiDoc);

  log("Code generation completed 🚀");
};

run().catch((error) => logError("Code generation failed ❌", error));
