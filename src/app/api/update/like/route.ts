import { likeComment, likePost } from "@/utils/api/posts/like";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        // arguments and permissions
        const { type, id, user_id, what } = await request.json();

        if (!id || !user_id || !what) {
            throw "id and user_id and what are undefined";
        }

        // verifying permissions & privacy
        tokenVerify({ request, id: [user_id] });

        switch (what) {
            case "post": {
                return await likePost({ id, user_id });
            }
            case "comment": {
                return await likeComment({ type, id, user_id });
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};
