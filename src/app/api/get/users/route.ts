import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_ids = searchParams.get("user_ids")?.split(",");
        const user_names = searchParams.get("user_names")?.split(",");

        if (!(user_ids || user_names)) {
            throw "user_ids and user_names are undefined or empty";
        }

        const { data, error } = (await supabaseServer
            .from("users")
            .select(`*, profile:profiles(*), post_ids:posts(id)`)
            .limit(3, { referencedTable: "post_ids" })
            .in(user_ids ? "id" : "username", (user_ids || user_names)!)) as {
            data: (User & {
                profile: Profile;
                post_ids: { id: string }[];
            })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                users: data.map(({ password, ...user }) => ({
                    ...user,
                    post_ids: user.post_ids.map((id) => id.id),
                })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};
