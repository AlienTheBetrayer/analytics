export type PermissionRoles = 'user' | 'admin';

export type LoginData = {
	role: PermissionRoles;
} | false;