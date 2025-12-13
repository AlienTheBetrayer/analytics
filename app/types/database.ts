export type AnalyticsType = {
	id: string;
	project_id: string;
	analytics_meta_id: string;
};

export type AnalyticsMetaType = {
	id: string;
	type: string;
	description?: string;
	created_at?: string;
};

export type ProjectType = {
	id: string;
	name: string;
	created_at?: string;
};

export type ProjectAggregatesType = {
	project_id: string;
	analytics_meta_id: string;
	visits?: number;
	last_updated?: string;
};

// GET
export type ProjectDataType = {
    id: string;
    aggregates: ProjectAggregatesType;
    metaData: AnalyticsMetaType[];
}