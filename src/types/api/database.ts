export type Analytics = {
	id: string;
	project_id: string;
	analytics_meta_id: string;
	created_at?: string;
};

export type AnalyticsMeta = {
	id: string;
	type: string;
	description?: string;
	created_at?: string;
};

export type ProjectAggregate = {
	project_id: string;
	visits?: number;
	last_updated?: string;
};

export type Project = {
	id: string;
	name: string;
	created_at?: string;
};

export type Token = {
	id: string;
	user_id: string;
	token: string;
};

export type User = {
	id: string;
	username: string;
	password: string;
	role: "user" | "admin";
	created_at?: string;
};

// GET
export type ProjectResponseData = {
	id: string;
	aggregates: ProjectAggregate;
	metaData: AnalyticsMeta[];
};
