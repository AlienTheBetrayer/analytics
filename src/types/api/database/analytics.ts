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

