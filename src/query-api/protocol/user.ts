import { Color, Profile } from "@/types/tables/account";
import { User } from "@supabase/supabase-js";

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
