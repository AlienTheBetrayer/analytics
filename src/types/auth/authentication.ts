import { Profile } from "@/types/tables/account";

/**
 * currently available roles (each role has its own permissions)
 */
export type AuthenticationRole = "user" | "admin" | "op";

/**
 * type for refresh / access tokens and their payloads
 */
export type AuthenticationToken = {
    id: string;
    session_id: string;
    username: string;
    role: AuthenticationRole;
    profile: Profile;
};
