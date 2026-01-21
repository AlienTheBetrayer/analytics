import { AuthenticationToken } from "@/types/auth/authentication";
import { APIResponseType } from "@/types/response";
import { Profile, User } from "@/types/tables/account";


/**
 * users, profiles
 */
export type ResponseLogin = {
    user: User & { profile: Profile };
    payload: AuthenticationToken;
    message?: string;
    response?: {
        data: {
            error?: string;
            type?: APIResponseType;
        };
    };
    type?: string;
};
