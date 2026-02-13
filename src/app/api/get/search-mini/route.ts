/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const type = searchParams.get("type");
        const user_id = searchParams.get("user_id");
        const query = searchParams.get("query");

        if (!type) {
            throw "type is undefined";
        }

        switch (type) {
            case "users": {
                if (!query) {
                    throw "query is undefined";
                }

                const { data, error } = await supabaseServer
                    .from("users")
                    .select("*, profile:profiles(*)")
                    .ilike("username", `%${query}%`)
                    .order("last_seen_at", { ascending: false });

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, users: data }, 200);
            }
            case "friends": {
                if (!user_id) {
                    throw "user_id is undefined";
                }

                const { data, error } = (await supabaseServer
                    .from("friends")
                    .select(
                        `  
                        user1:users!friends_user1_id_fkey(*, profile:profiles(*)), 
                        user2:users!friends_user2_id_fkey(*, profile:profiles(*))`,
                    )
                    .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)) as {
                    data:
                        | {
                              user1: User & { profile: Profile };
                              user2: User & { profile: Profile };
                          }[]
                        | null;
                    error: PostgrestError | null;
                };

                if (error) {
                    throw error;
                }

                return nextResponse(
                    {
                        success: true,
                        users: data
                            ?.map((d) =>
                                d.user1?.id === user_id
                                    ? { ...(d.user2 ?? []) }
                                    : { ...(d.user1 ?? []) },
                            )
                            ?.map(({ password, ...user }) => ({ ...user })),
                    },
                    200,
                );
            }
            default: {
                throw "type is invalid. available: users/friends";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};
