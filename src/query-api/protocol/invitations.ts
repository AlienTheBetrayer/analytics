import { CacheAPIFunctions } from "@/query-api/protocol";
import { Profile, User } from "@/types/tables/account";
import { Invitation } from "@/types/tables/invitations";
import axios from "axios";

export type CacheAPIProtocolInvitations = {
    invitations: {
        key: ["invitations", string];
        data: (Invitation & {
            user: Pick<User, "username"> & {
                profile: Pick<Profile, "avatar_url" | "color">;
            };
        })[];
    };

    invitation: {
        key: ["invitation", string, string | null];
        data: Invitation & { isMember: boolean };
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

        invitation: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("invitation_id is undefined");
            }

            return (
                await axios.get("/api/get/invitation", {
                    params: { invitation_id: args[0], user_id: args[1] },
                })
            ).data.invitation;
        },
    };
