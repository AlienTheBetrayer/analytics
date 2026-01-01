import { nextResponse } from "@/utils/response";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (request: NextRequest) => {
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return nextResponse({ error: "Invalidated session." }, 400);
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET as string
        );

        return nextResponse({ payload }, 200);
    } catch {
        return nextResponse({ error: "Invalidated session." }, 400);
    }
};
