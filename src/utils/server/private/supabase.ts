import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "../public/keys";
import { secretKey } from "./keys";

export const supabaseServer = createClient(supabaseUrl, secretKey);
