import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticationToken } from "@/types/auth/authentication";

export const TokenRoles = ["user", "admin", "op"];

type TokenRole = "user" | "admin" | "op";

/**
 * verifies the user's permissions and throws if they're not aligned
 * @param request next.js object of the request
 * @param id the id of the user that's required to do the operation
 * @param role the role of the user that's required
 * @returns true if permissions are aligned, otherwise throws
 */
export const tokenVerify = (config: {
    request: NextRequest;
    id?: string[];
    role?: TokenRole;
}) => {
    // checking if refresh token even exists
    const accessToken = config.request.cookies.get("accessToken")?.value;

    if (!accessToken) {
        throw "Not authenticated.";
    }

    try {
        // verifying the age
        const payload = jwt.verify(
            accessToken,
            process.env.ACCESS_SECRET as string,
        ) as AuthenticationToken;

        // allowing op to do anything
        if (payload.role === "op") {
            return true;
        }

        // verifying id
        if (config.id && (!payload.id || !config.id.includes(payload.id))) {
            throw "Wrong user.";
        }

        // verifying role
        if (
            config.role &&
            (!payload.role ||
                TokenRoles.indexOf(payload.role) <
                    TokenRoles.indexOf(config.role))
        ) {
            throw "Wrong permissions.";
        }

        return true;
    } catch {
        throw "Not authenticated.";
    }
};
