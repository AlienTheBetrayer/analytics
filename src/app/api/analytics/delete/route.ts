import {
    deleteEvents,
    deleteProjects,
} from "@/utils/api/analytics/delete/deleteEvents";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    tokenVerify(request, undefined, "admin");

    try {
        const { id, type } = (await request.json()) as {
            id: string[];
            type: "project" | "event";
        };

        if (!id || !type) {
            console.error("id and type are missing.");
            return nextResponse({ error: "id and type are missing." }, 400);
        }

        switch (type) {
            case "event": {
                return await deleteEvents(id);
            }
            case "project": {
                return await deleteProjects(id);
            }
            default: {
                console.error("type is not [event, project]");
                return nextResponse(
                    { error: "type is not [event, project]" },
                    400
                );
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed deleting the data." }, 400);
    }
};
