declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_ANON_KEY: string;
      SUPABASE_URL: string;
      IS_DEV: "true" | "false";
    }
  }
}

export {};
