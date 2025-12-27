export type ProfileVisibility = "everyone" | "friends" | "nobody";
export type ProfileAllowedFriendRequests = "everyone" | "nobody";

export type Profile = {
	id: string;
	user_id: string;
	status?: string;
	bio?: string;
    name?: string;
	oneliner?: string;
	visibility: ProfileVisibility;
    allowed_friend_requests: ProfileAllowedFriendRequests;
};
