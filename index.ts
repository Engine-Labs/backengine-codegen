#!/usr/bin/env node
import "dotenv/config";
import { run } from "./app";
import { logError } from "./src/utils";

run().catch((error) => {
  logError("Code generation failed ❌", error);
});
