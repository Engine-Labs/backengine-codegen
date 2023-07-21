import type { Tables } from "./types";
import { log } from "./log";
import axios from "axios";

export const fetchTables = async (): Promise<Tables> => {
  // TODO: use proxy
  const tablesResponse = await axios.get<Tables>("http://0.0.0.0:1337/tables");
  log("Fetched table metadata");
  return tablesResponse.data;
};
