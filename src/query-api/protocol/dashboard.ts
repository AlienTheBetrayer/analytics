import { CacheAPIFunctions } from "@/query-api/protocol";
import { Project } from "@/types/tables/project";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

/**
 * state
 */
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

/**
 * functions
 */
export const CacheAPIFunctionsDashboard: CacheAPIFunctions<CacheAPIProtocolDashboard> =
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        projects: async (args: unknown[]) => {
            return (
                await refreshedRequest({
                    route: "/api/get/projects",
                    method: "GET",
                })
            ).data.projects;
        },
        
        events: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("project_id is undefined");
            }

            return (
                await refreshedRequest({
                    route: "/api/get/events",
                    method: "GET",
                    config: {
                        params: {
                            project_id: args[0],
                        },
                    },
                })
            ).data.events;
        },
    };
