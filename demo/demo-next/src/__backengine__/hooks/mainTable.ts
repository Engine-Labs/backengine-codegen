import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const useMainTables = () => {
  const [mainTables, setMainTables] = useState<any[]>([]);

  useEffect(() => {
    fetchMainTables();
  }, []);

  const fetchMainTables = async () => {
    try {
      const { data, error } = await supabase.from("main_table").select("*");
      if (error) {
        throw error;
      }
      setMainTables(data || []);
    } catch (error) {
      console.error("Error fetching", error);
    }
  };

  return { mainTables };
};

export default useMainTables;
