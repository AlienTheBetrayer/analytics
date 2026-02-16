import { Project } from "@/types/tables/project";

export type CacheAPIProtocolDashboard = {
    projects: {
        key: ["projects"];
        data: Record<
            string,
            Project & {
                event_count: number;
            }
        >;
    };
    events: {
        key: ["events", string];
        data: Record<string, Event>;
    };
};
