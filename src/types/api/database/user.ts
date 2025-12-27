export type PermissionRole = "user" | "admin";

export type User = {
	id: string;
	username: string;
	password: string;
	role: PermissionRole;
	created_at?: string;
	last_seen_at?: string;
};
