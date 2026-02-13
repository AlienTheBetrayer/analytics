import { Profile, User } from "@/types/tables/account";

/**
 * data type for mini-search response
 */
export type MiniSearchData = (User & { profile: Profile })[];
