import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const useTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) {
        throw error;
      }
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching", error);
    }
  };

  return { tasks };
};

export default useTasks;
