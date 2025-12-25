import type { AnalyticsMeta } from "./database/analytics";
import type { ProjectAggregate } from "./database/projects";

export type ProjectResponseData = {
	id: string;
	aggregates: ProjectAggregate;
	metaData: AnalyticsMeta[];
};
