import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticationToken } from "@/types/api/authentication";
import { PermissionRole } from "@/types/api/database/user";

/**
 * verifies the user's permissions and throws if they're not aligned
 * @param request next.js object of the request
 * @param id the id of the user that's required to do the operation
 * @param role the role of the user that's required
 * @returns true if permissions are aligned, otherwise throws
 */
export const tokenVerify = (request: NextRequest, id?: string, role?: PermissionRole) => {
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

        // verifying the id
        if (id && payload.id !== id) {
            throw "Wrong user.";
        }

        if (role && payload.role !== role) {
            throw "Wrong permissions.";
        }

        return true;
    } catch {
        throw "Not authenticated.";
    }
};
