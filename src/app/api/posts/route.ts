import { supabaseServer } from "@/server/private/supabase";
import { Post } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // params
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    // selecting the route
    switch (type) {
        case "single": {
            if (!id) {
                console.error("[id] is missing.");
                return nextResponse({
                    error: "[id] is missing",
                });
            }

            const { data, error } = (await supabaseServer
                .from("users")
                .select("*, profile:profiles(*), posts:posts(*)")
                .eq("username", username)
                .eq("posts.id", id)) as {
                data: Post[];
                error: PostgrestError | null;
            };

            if (error) {
                console.error(error);
                return nextResponse(error, 400);
            }

            return nextResponse({ posts: data });
        }
        case "all": {
            if (!username) {
                console.error("[username] is missing.");
                return nextResponse({
                    error: "[username] is missing",
                });
            }

            const { data, error } = (await supabaseServer
                .from("users")
                .select("*, profile:profiles(*), posts:posts(*)")
                .eq("username", username)) as {
                data: Post[];
                error: PostgrestError | null;
            };

            if (error) {
                console.error(error);
                return nextResponse(error, 400);
            }

            return nextResponse({ posts: data });
        }
        default: {
            console.error("[type] is wrong. acceptable types: [all, single]");
            return nextResponse({
                error: "[type] is wrong. acceptable types: [all, single]",
            });
        }
    }
};
