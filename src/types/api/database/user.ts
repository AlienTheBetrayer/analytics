export type PermissionRole = "user" | "admin" | null;

export type User = {
	id: string;
	username: string;
	password: string;
	role: PermissionRole;
	created_at?: string;
};
