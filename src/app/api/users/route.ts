import { ResponseUsers, ResponseUsersAPI } from "@/types/api/responses/users";
import { includeMap } from "@/utils/api/users/includeMap";
import { selectUser } from "@/utils/api/users/selectUser";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // search params
    const { searchParams } = request.nextUrl;
    const type = new Set((searchParams.get("type") || "user").split(","));

    const include: string[] = [];
    if (type.size && !type.has("user")) {
        Object.entries(includeMap).forEach(([key, value]) => {
            if (type.has(key)) {
                include.push(value);
            }
        });
    }

    const id = searchParams.get("id")?.split(",");
    const username = searchParams.get("username")?.split(",");

    // request
    try {
        const { data, error } = (await selectUser(
            include.join(","),
            id,
            username
        )) as {
            data: ResponseUsersAPI[];
            error: PostgrestError | null;
        };

        if (error) {
            console.error(error);
            return nextResponse({ error }, 400);
        }

        // return object
        const users: ResponseUsers[] = data.map((entry) => ({
            id: entry.id,
            role: entry.role,
            username: entry.username,
            last_seen_at: entry.last_seen_at,
            created_at: entry.created_at,
            profile: !type.has("profile") ? undefined : entry.profile,
            colors: !type.has("colors") ? undefined : Array.from(entry.colors ?? []),
            friends: !type.has("friends") ? undefined : Array.from(
                new Set([
                    ...(entry.friends1?.map((f) =>
                        entry.id === f.user1_id ? f.user2_id : f.user1_id
                    ) ?? []),
                    ...(entry.friends2?.map((f) =>
                        entry.id === f.user1_id ? f.user2_id : f.user1_id
                    ) ?? []),
                ])
            ),
            incoming: !type.has("friend_requests") ? undefined :Array.from(
                new Set([
                    ...(entry.incoming?.map((i) =>
                        entry.id === i.from_id ? i.to_id : i.from_id
                    ) ?? []),
                ])
            ),
            outcoming: !type.has("friend_requests") ? undefined :Array.from(
                new Set([
                    ...(entry.outcoming?.map((o) =>
                        entry.id === o.from_id ? o.to_id : o.from_id
                    ) ?? []),
                ])
            ),
        }));

        return nextResponse({ users }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ error }, 400);
    }
};
