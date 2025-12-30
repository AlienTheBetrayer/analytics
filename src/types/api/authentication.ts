import type { PermissionRole } from "./database/user";

export type AuthenticationToken = {
	id: string;
	role: PermissionRole;
	session_id: string;
};
