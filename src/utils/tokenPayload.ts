import { AuthenticationToken } from "@/types/api/authentication";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * gets the user's data via an access token and returns it (can be undefined if we're not)
 * @param request next.js request object
 * @returns payload in case the user is authenticated and undefined otherwise
 */
export const tokenPayload = (request: NextRequest) => {
    // checking if refresh token even exists
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return undefined;
    }

    try {
        // verifying the age and get the payload
        const payload = jwt.verify(
            accessToken,
            process.env.ACCESS_SECRET as string,
        ) as AuthenticationToken;

        return payload;
    } catch {
        return undefined;
    }
};
