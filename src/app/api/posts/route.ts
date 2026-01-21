import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // params
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    try {
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
                    data: (User & { profile: Profile; posts: Post[] })[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    {
                        data: data.map(({ password, ...rest }) => ({
                            ...rest,
                        }))?.[0],
                    },
                    200,
                );
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
                    data: (User & { profile: Profile; posts: Post[] })[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    data.map(({ password, ...rest }) => ({
                        ...rest,
                    }))?.[0],

                    200,
                );
            }
            default: {
                console.error(
                    "[type] is wrong. acceptable types: [all, single]",
                );
                return nextResponse({
                    error: "[type] is wrong. acceptable types: [all, single]",
                });
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed fetching posts." }, 400);
    }
};
