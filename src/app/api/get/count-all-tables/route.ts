import { nextResponse } from "@/utils/api/response";
import { supabaseServer } from "@/utils/server/private/supabase";
import { NextRequest } from "next/server";

export const CountAllTablesEntries = [
    "conversations",
    "events",
    "projects",
    "messages",
    "colors",
    "posts",
    "users",
    "tokens",
    "noteboards",
    "noteboard_elements",
    "contact_messages",
    "invitations",
] as const;

export const GET = async (request: NextRequest) => {
    try {
        const data = await Promise.all(
            CountAllTablesEntries.map(async (table) => ({
                table,
                response: await supabaseServer.from(table).select("*", { count: "exact", head: true }),
            })),
        );

        for (const { response } of data) {
            if (response.error) {
                throw response.error;
            }
        }

        return nextResponse(
            {
                success: true,
                count: data.map((d) => ({ table: d.table, count: d.response.count ?? 0 })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};
