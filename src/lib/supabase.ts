import { createClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: number;
          word: string;
          meaning: string;
          created_at: timestamptz;
        };
        Insert: {
          id?: number;
          word: string;
          meaning: string;
          created_at?: timestamptz;
        };
        Update: {
          id?: number;
          word?: string;
          meaning?: string;
          created_at?: timestamptz;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseClient() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    );
  }

  client = createClient<Database>(url, publishableKey);
  return client;
}
