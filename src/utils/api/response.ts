import { NextResponse } from "next/server";

/**
 * Sends a next response with data and response type + allowed from other servers
 * @param data json body object
 * @param status status code
 * @returns NextResponse object
 */
export const nextResponse = <T extends object>(data: T, status = 200) => {
    return NextResponse.json(
        { ...data },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            status,
        },
    );
};
