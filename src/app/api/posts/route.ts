import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { Like, Post } from "@/types/tables/posts";
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
                    .select("*, profile:profiles(*), posts:posts!inner(*)")
                    .eq("posts.id", id)) as {
                    data: (User & { profile: Profile; posts: Post[] })[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    data.map(({ password, ...rest }) => ({
                        ...rest,
                    }))?.[0],
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

                const { data: postData, error: postError } =
                    (await supabaseServer
                        .from("users")
                        .select("*, profile:profiles(*), posts:posts(*)")
                        .eq("username", username)
                        .order("edited_at", {
                            referencedTable: "posts",
                            ascending: false,
                            nullsFirst: false,
                        })
                        .order("created_at", {
                            referencedTable: "posts",
                            ascending: false,
                        })) as {
                        data: (User & { profile: Profile; posts: Post[] })[];
                        error: PostgrestError | null;
                    };

                if (postError) {
                    console.error(postError);
                    return nextResponse(postError, 400);
                }

                const { data: likesData, error: likesError } =
                    (await supabaseServer
                        .from("likes")
                        .select("*", { head: true, count: "exact" })
                        .in(
                            "post_id",
                            postData[0].posts.map((p) => p.id),
                        )) as {
                        data: Like[];
                        error: PostgrestError | null;
                    };

                if (likesError) {
                    console.error(likesError);
                    return nextResponse(likesError, 400);
                }

                return nextResponse(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    postData.map(({ password, ...rest }) => ({
                        ...rest,
                        likes: likesData,
                    }))?.[0],
                    200,
                );
            }
            default: {
                console.error(
                    "[type] is wrong. acceptable types: [all, single]",
                );
                return nextResponse(
                    {
                        error: "[type] is wrong. acceptable types: [all, single]",
                    },
                    400,
                );
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed fetching posts." }, 400);
    }
};
