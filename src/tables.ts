import type { Tables } from "./types";
import { log } from "./log";

// TODO: this is test data
const tables: Tables = [
  {
    id: 28641,
    schema: "public",
    name: "main_table",
    rls_enabled: false,
    rls_forced: false,
    replica_identity: "DEFAULT",
    bytes: 16384,
    size: "16 kB",
    live_rows_estimate: 0,
    dead_rows_estimate: 0,
    comment: null,
    primary_keys: [
      {
        schema: "public",
        table_name: "main_table",
        name: "id",
        table_id: 28641,
      },
    ],
    relationships: [],
  },
  {
    id: 28655,
    schema: "public",
    name: "tasks",
    rls_enabled: true,
    rls_forced: false,
    replica_identity: "DEFAULT",
    bytes: 8192,
    size: "8192 bytes",
    live_rows_estimate: 0,
    dead_rows_estimate: 0,
    comment: null,
    primary_keys: [
      {
        schema: "public",
        table_name: "tasks",
        name: "id",
        table_id: 28655,
      },
    ],
    relationships: [],
  },
];

export const fetchTables = async (): Promise<Tables> => {
  log("Fetched table metadata");
  return tables;
};
