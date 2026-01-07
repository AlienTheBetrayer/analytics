import { AuthenticationToken } from "@/types/auth/authentication";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * gets the user's data via an access and refresh token and returns it (can be undefined if we're not)
 * @param request next.js request object
 * @returns payload in case the user is authenticated and undefined otherwise
 */
export const tokenPayload = (
    request: NextRequest,
    select: "access" | "refresh" | "all" = "all"
) => {
    // checking if refresh token even exists
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
        console.error("both tokens are missing");
        return undefined;
    }

    try {
        let payloadAccess: AuthenticationToken | undefined;
        let payloadRefresh: AuthenticationToken | undefined;

        // verifying the age and get the payload
        if (select === "access" || select === "all") {
            payloadAccess = !accessToken
                ? undefined
                : (jwt.verify(
                      accessToken,
                      process.env.ACCESS_SECRET as string
                  ) as AuthenticationToken);
        }
        
        if (select === "refresh" || select === "all") {
            payloadRefresh = !refreshToken
                ? undefined
                : (jwt.verify(
                      refreshToken,
                      process.env.REFRESH_SECRET as string
                  ) as AuthenticationToken);
        }

        return { accessToken: payloadAccess, refreshToken: payloadRefresh };
    } catch {
        return undefined;
    }
};
