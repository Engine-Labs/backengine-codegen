#!/usr/bin/env node
import "dotenv/config";
import { run } from "./app";
import { logError } from "./src/utils";

export * from "./app";

run().catch((error) => {
  logError("Code generation failed ❌", error);
});
