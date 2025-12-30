import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        // verifying the id in the body
        const { id } = await request.json();

        if (id === undefined) {
            return nextResponse({ error: "id is missing." }, 400);
        }

        tokenVerify(request, id, "user");

        return nextResponse({ message: "User is authenticated!" }, 200);
    } catch {
        return nextResponse({ error: "Failed the attempt." }, 400);
    }
};
