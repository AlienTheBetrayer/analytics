export type ProjectAggregate = {
	project_id: string;
	visits?: number;
	last_updated?: string;
};

export type Project = {
	id: string;
	name: string;
	created_at?: string;
	last_event_at?: string;
};