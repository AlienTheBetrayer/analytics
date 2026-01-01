import type { PermissionRole } from "./database/user";

export type AuthenticationToken = {
    id: string;
	session_id: string;
    username: string;
	role: PermissionRole;
};
