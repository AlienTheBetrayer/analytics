import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { Comment, Post } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // params
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const user_id = searchParams.get("user_id");

    try {
        let results:
            | (User & {
                  profile: Profile;
                  posts: (Post & { post_likes: [{ count: number }] } & {
                      privacy: { post_likes: boolean; comments: boolean };
                  } & { comments?: Comment[] })[];
              })[]
            | null = null;
        let error: PostgrestError | string | null = null;

        // selecting the route and fetching data
        switch (type) {
            case "single": {
                if (!id) {
                    error = "[id] is missing.";
                    break;
                }

                ({ data: results, error } = await supabaseServer
                    .from("users")
                    .select(
                        "*, profile:profiles(*), posts:posts!inner(*, post_likes:post_likes(count), privacy:post_privacy(comments, likes, edited_at), comments:comments(*, comment_likes:comment_likes(count)))",
                    )
                    .eq("posts.id", id)
                    .order("created_at", {
                        referencedTable: "posts.comments",
                        ascending: false,
                    }));

                break;
            }
            case "all": {
                if (!username) {
                    error = "[username] is missing.";
                    break;
                }

                ({ data: results, error } = await supabaseServer
                    .from("users")
                    .select(
                        `*, profile:profiles(*), posts:posts(*, post_likes:post_likes(count), privacy:post_privacy(comments, likes, edited_at))`,
                    )
                    .eq("username", username)
                    .order("edited_at", {
                        referencedTable: "posts",
                        ascending: false,
                        nullsFirst: false,
                    })
                    .order("created_at", {
                        referencedTable: "posts",
                        ascending: false,
                    }));

                break;
            }
            default: {
                error = "[type] is wrong. acceptable types: [all, single]";
                break;
            }
        }

        // error
        if (error || !results) {
            throw error;
        }

        // own likes
        let ownLikes: { post_id: string; user_id: string }[] | null = [];

        if (user_id) {
            ({ data: ownLikes, error } = await supabaseServer
                .from("post_likes")
                .select("post_id, user_id")
                .eq("user_id", user_id)
                .in(
                    "post_id",
                    results[0].posts.map((p) => p.id),
                ));
        }

        // confirming no errors
        if (error) {
            throw error;
        }

        const newResults = results.map(({ posts, ...rest }) => ({
            ...rest,
            posts: posts.map(({ post_likes, ...post }) => ({
                ...post,
                post_likes: post_likes[0].count,
            })),
        }));

        // returning data
        return nextResponse(
            {
                message: "Successfully fetched posts!",
                results: newResults[0],
                ownLikes: ownLikes?.map((l) => l.post_id),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed fetching posts." }, 400);
    }
};
