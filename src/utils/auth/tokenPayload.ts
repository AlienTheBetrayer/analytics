import { AuthenticationToken } from "@/types/auth/authentication";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * gets the user's data via an access and refresh token and returns it (can be undefined if we're not)
 * @param request next.js request object
 * @returns payload in case the user is authenticated and undefined otherwise
 */
export const tokenPayload = (request: NextRequest) => {
    // checking if refresh token even exists
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
        return;
    }

    try {
        // verifying the age and get the payload
        const payloadAccess = !accessToken
            ? undefined
            : (jwt.verify(
                  accessToken,
                  process.env.ACCESS_SECRET as string,
              ) as AuthenticationToken);
        const payloadRefresh = !refreshToken
            ? undefined
            : (jwt.verify(
                  refreshToken,
                  process.env.REFRESH_SECRET as string,
              ) as AuthenticationToken);

        return { accessToken: payloadAccess, refreshToken: payloadRefresh };
    } catch {
        return;
    }
};
