import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const url = import.meta.env?.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Supabase keys not found (.env)");
export const supabase = createClient(url, key);
