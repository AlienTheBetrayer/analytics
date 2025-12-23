export type APIResponseType =
    | 'unknown'
	| "fields_missing"
	| "user_registered"
	| "user_already_exists"
	| "user_logged_in"
	| "user_refreshed"
	| "token_theft"
    | "not_authenticated"
    | "user_not_exists";