import { createClient } from "@supabase/supabase-js";
import { publishableKey, supabaseUrl } from "./keys";

export const supabaseClient = createClient(supabaseUrl, publishableKey);
