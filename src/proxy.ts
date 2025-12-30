import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { nextResponse } from "./utils/response";

export const proxy = async (request: NextRequest) => {
    // const token = request.cookies.get("accessToken");

    // if (token === undefined) {
    //     return nextResponse({ error: "Unauthorized" }, 400);
    // }

    try {
        return NextResponse.next();
        
    } catch (error) {
        const message = error instanceof Error ? error.message : "jwt error";
        return nextResponse({ error: message }, 401);
    }
};