export type User = {
	id: string;
	username: string;
	password: string;
	role: "user" | "admin";
	created_at?: string;
};
