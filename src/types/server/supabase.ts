import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const publishableKey = process.env
	.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const secretKey = process.env.SUPABASE_SECRET_KEY as string;

export const supabaseClient = createClient(supabaseUrl, publishableKey);
export const supabaseServer = createClient(supabaseUrl, secretKey);
