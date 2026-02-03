import { notificationListeners } from "@/notifications/data/init";
import { queryDelete, queryInvalidate } from "@/query/auxiliary";
import { queryCache } from "@/query/init";
import { Event, Project } from "@/types/tables/project";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios from "axios";

export const dashboardEmulateEvents = async (config: {
    project_name: string;
    event_type: string;
    description?: string;
}) => {
    const res = await axios.post("/api/analytics/send/", config);
    const data = res.data.sent as {
        project: Project;
        event: Event;
    };

    queryInvalidate({ key: ["projects"] });
    queryInvalidate({ key: ["events", data.event.project_id] });

    return res;
};

export const dashboardDeleteEvent = async (config: { event: Event }) => {
    const res = await refreshedRequest({
        route: "/api/delete/event",
        body: { event_id: config.event.id },
        method: "POST",
    });

    queryInvalidate({
        key: ["events", config.event.project_id],
    });
    queryInvalidate({ key: ["projects"] });

    return res;
};

export const dashboardDeleteEvents = async (config: { project: Project }) => {
    const res = await refreshedRequest({
        route: "/api/delete/events",
        body: { project_id: config.project.id },
        method: "POST",
    });

    queryInvalidate({
        key: ["events", config.project.id],
    });
    queryInvalidate({ key: ["projects"] });

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Warning",
            tab: "Dashboard",
            title: "Events wiped",
            description: "You have just deleted all events from a project!",
            type: "Events deleted",
        },
    });

    return res;
};

export const dashboardDeleteProject = async (config: { project: Project }) => {
    const res = await refreshedRequest({
        route: "/api/delete/project",
        body: { project_id: config.project.id },
        method: "POST",
    });

    queryInvalidate({
        key: ["events", config.project.id],
    });
    queryInvalidate({ key: ["projects"] });

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Warning",
            tab: "Dashboard",
            title: "Project deleted!",
            description: "You have just deleted a project",
            type: "Project deleted",
        },
    });

    return res;
};

export const dashboardSync = async (config: { selectedProjectId?: string }) => {
    const data = queryCache.get({ key: ["projects"] });

    if (data) {
        for (const id of Object.keys(data)) {
            queryDelete({
                key: ["events", id],
            });
        }
    }

    queryInvalidate({
        key: ["projects"],
    });

    if (config.selectedProjectId) {
        queryInvalidate({
            key: ["events", config.selectedProjectId],
            silent: false,
        });
    }

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Information",
            tab: "Dashboard",
            title: "Data synced!",
            description: "Analytics data has been successfully re-fetched.",
            type: "Analytics Sync",
        },
    });
};
