import axios from "axios";
import { log } from "../utils";

export type ColumnResponse = {
  tableId: number;
  schema: string;
  table: string;
  id: string;
  ordinalPosition: number;
  name: string;
  defaultValue: unknown;
  dataType: string;
  format: string;
  isIdentity: boolean;
  identityGeneration: "ALWAYS" | "BY DEFAULT" | null;
  isGenerated: boolean;
  isNullable: boolean;
  isUpdatable: boolean;
  isUnique: boolean;
  enums: string[];
  check: string | null;
  comment: string | null;
};

export type TableResponse = {
  id: number;
  schema: string;
  name: string;
  rlsEnabled: boolean;
  rlsForced: boolean;
  replicaIdentity: "DEFAULT" | "INDEX" | "FULL" | "NOTHING";
  bytes: number;
  size: string;
  liveRowsEstimate: number;
  deadRowsEstimate: number;
  comment: string | null;
  columns?: ColumnResponse[];
  primaryKeys: {
    schema: string;
    tableName: string;
    name: string;
    tableId: number;
  }[];
  relationships: {
    id: number;
    constraintName: string;
    sourceSchema: string;
    sourceTableName: string;
    sourceColumnName: string;
    targetTableSchema: string;
    targetTableName: string;
    targetColumnName: string;
  }[];
};

export type TablesResponse = TableResponse[];

export async function fetchTables(): Promise<{
  tables: TablesResponse;
  joinTables: TablesResponse;
}> {
  const tablesResponse = await axios.get<TablesResponse>(
    `${process.env.BACKENGINE_BASE_URL}/api/v1/projects/${process.env.BACKENGINE_PROJECT_ID}/pg-meta/tables`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BACKENGINE_API_KEY}`,
        Accept: "application/json",
      },
    }
  );
  log("Fetched table metadata");

  const publicTables = tablesResponse.data.filter(
    (table) => table.schema === "public"
  );

  // TODO: handle tables with a primary key column not named "id"
  const tables = publicTables.filter(({ primaryKeys }) =>
    primaryKeys.some(({ name }) => name === "id")
  );
  const joinTables = publicTables.filter(
    ({ primaryKeys, relationships }) =>
      primaryKeys.length === 2 && relationships.length === 2
  );
  return { tables, joinTables };
}
