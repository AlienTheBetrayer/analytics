import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticationToken } from "@/types/api/authentication";

export const TokenRoles = ["user", "admin", "op"];

type TokenRole = (typeof TokenRoles)[number];

/**
 * verifies the user's permissions and throws if they're not aligned
 * @param request next.js object of the request
 * @param id the id of the user that's required to do the operation
 * @param role the role of the user that's required
 * @returns true if permissions are aligned, otherwise throws
 */
export const tokenVerify = (request: NextRequest, id?: string, role?: TokenRole) => {
    // checking if refresh token even exists
    const accessToken = request.cookies.get("accessToken")?.value;

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
        if(payload.role === 'op') {
            return true;
        }

        // verifying id
        if (!payload.id || (id && payload.id !== id)) {
            throw "Wrong user.";
        }

        // verifying role
        if (
            !payload.role ||
            (role && TokenRoles.indexOf(payload.role) < TokenRoles.indexOf(role))
        ) {
            throw "Wrong permissions.";
        }

        return true;
    } catch {
        throw "Not authenticated.";
    }
};
