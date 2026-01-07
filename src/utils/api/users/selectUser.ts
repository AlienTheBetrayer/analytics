import "server-only";
import { supabaseServer } from "@/server/private/supabase";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * fetches and optionally filters data by slices / id / username
 * @param include which slices of data to include
 * @param id optional ids array to fetch only those names
 * @param username optional username array to fetch only those names
 * @returns a promise with data and error
 */
export const selectUser = async (
    include: string,
    id?: string[] | null | undefined,
    username?: string[] | null | undefined
) => {
    let ret: { data: unknown; error: PostgrestError | null };
    if (id?.length) {
        ret = await supabaseServer
            .from("users")
            .select(
                `id, username, role, created_at, last_seen_at${include ? ", " + include : ""}`
            )
            .in("id", id);
    } else if (username?.length) {
        ret = await supabaseServer
            .from("users")
            .select(
                `id, username, role, created_at, last_seen_at${include ? ", " + include : ""}`
            )
            .in("username", username);
    } else {
        ret = await supabaseServer
            .from("users")
            .select(
                `id, username, role, created_at, last_seen_at${include ? ", " + include : ""}`
            );
    }

    return { ...ret };
};
