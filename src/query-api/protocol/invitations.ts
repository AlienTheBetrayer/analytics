import { CacheAPIFunctions } from "@/query-api/protocol";
import { Invitation } from "@/types/tables/invitations";
import axios from "axios";

export type CacheAPIProtocolInvitations = {
    invitations: {
        key: ["invitations", string];
        data: Invitation[];
    };
};

export const CacheAPIProtocolInvitations: CacheAPIFunctions<CacheAPIProtocolInvitations> =
    {
        invitations: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("conversation_id is undefined");
            }
            
            return (
                await axios.get("/api/get/invitations", {
                    params: {
                        conversation_id: args[0],
                    },
                })
            ).data.invitations;
        },
    };
