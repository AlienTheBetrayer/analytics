import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/server/private/supabase";

export const POST = async (request: NextRequest) => {
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            throw "unauthenticated";
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET as string,
        ) as { id: string; role: string; session_id: string };

        const { error: refreshError } = await supabaseServer
            .from("tokens")
            .delete()
            .eq("user_id", payload.id)
            .eq("session_id", payload.session_id);

        if (refreshError) {
            throw refreshError;
        }

        const response = NextResponse.json({ success: true }, { status: 200 });
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    } catch (error) {
        console.error(error);
        const response = NextResponse.json({ success: false }, { status: 400 });

        // ensuring empty cookies
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }
};
