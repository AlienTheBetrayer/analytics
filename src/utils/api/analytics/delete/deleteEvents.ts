import "server-only";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "../../response";

/**
 * deletes the events from the database
 * @param id the ids of the events
 */
export const deleteEvents = async (id: string[]) => {
    const { error } = await supabaseServer.from("events").delete().in("id", id);

    if (error) {
        console.error(error);
        return nextResponse({ error: "Failed deleting events." }, 400);
    }

    return nextResponse({ message: "Successfully deleted events!" }, 200);
};

/**
 * deletes the projects from the database
 * @param id the ids of the projecs
 */
export const deleteProjects = async (id: string[]) => {
    const { error } = await supabaseServer
        .from("projects")
        .delete()
        .in("id", id);

    if (error) {
        console.error(error);
        return nextResponse({ error: "Failed deleting the project." }, 400);
    }

    return nextResponse({ message: "Successfully deleted the project!" }, 200);
};
