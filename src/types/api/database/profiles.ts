export type ProfileVisibility = "everyone" | "friends" | "nobody";

export type Profile = {
	id: string;
	user_id: string;
	status?: string;
	bio?: string;
	oneliner?: string;
	visibility: ProfileVisibility;
};
