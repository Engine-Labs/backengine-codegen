import { log } from "./log";
import axios from "axios";
import type { TablesResponse } from "./types";

export const fetchTables = async (): Promise<TablesResponse> => {
  // TODO: use proxy
  const tablesResponse = await axios.get<TablesResponse>(
    "http://0.0.0.0:1337/tables"
  );
  log("Fetched table metadata");
  return tablesResponse.data;
};
