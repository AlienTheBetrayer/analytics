import { CacheAPIFunctions } from "@/query-api/protocol";
import { __user, __requests } from "@/query-api/utils";
import { Color, Profile, User } from "@/types/tables/account";
import axios from "axios";

/**
 * state
 */
export type CacheAPIProtocolUser = {
    user: {
        key: ["user", string];
        data: User & { profile: Profile; post_ids: string[] };
    };
    user__username: {
        key: ["user__username", string];
        data: CacheAPIProtocolUser["user"]["data"];
    };

    friends: {
        key: ["friends", string];
        data: string[];
    };

    requests_incoming: {
        key: ["requests_incoming", string];
        data: string[];
    };
    requests_outcoming: {
        key: ["requests_outcoming", string];
        data: string[];
    };

    colors: {
        key: ["colors", string];
        data: Color[];
    };

    relationship: {
        key: ["relationship", string, string];
        data: {
            sent: boolean;
            received: boolean;
            friends: boolean;
            message: boolean;
        };
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsUser: CacheAPIFunctions<CacheAPIProtocolUser> = {
    relationship: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("from_id is undefined");
        }

        if (!args[1]) {
            throw new Error("to_id is undefined");
        }

        return (
            await axios.get("/api/get/relationship", {
                params: { from_id: args[0], to_id: args[1] },
            })
        ).data.relationship;
    },

    user: async (args: unknown[]) => {
        return __user(args, "id");
    },
    user__username: async (args: unknown[]) => {
        return __user(args, "name");
    },

    colors: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        return (
            await axios.get("/api/get/colors", {
                params: { user_id: args[0] },
            })
        ).data.colors;
    },

    friends: async (args: unknown[]) => {
        return await __requests("friends", args);
    },

    requests_incoming: async (args: unknown[]) => {
        return await __requests("incoming", args);
    },
    requests_outcoming: async (args: unknown[]) => {
        return await __requests("outcoming", args);
    },
};
