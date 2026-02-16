import { CacheAPIFunctions } from "@/query-api/protocol";
import { Noteboard, NoteboardElement } from "@/types/tables/notes";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

/**
 * state
 */
export type CacheAPIProtocolNoteboard = {
    noteboards: {
        key: ["noteboards", string];
        data: (Noteboard & { elements: NoteboardElement[] })[];
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsNoteboard: CacheAPIFunctions<CacheAPIProtocolNoteboard> =
    {
        noteboards: async (args: unknown[]) => {
            if (!args) {
                throw new Error("user_id is undefined");
            }

            return (
                await refreshedRequest({
                    route: "/api/get/noteboard",
                    method: "GET",
                    config: {
                        params: {
                            user_id: args[0],
                        },
                    },
                })
            ).data.noteboards;
        },
    };
