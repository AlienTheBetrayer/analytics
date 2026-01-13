import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { Event, Project } from "@/types/tables/project";
import { nextResponse } from "@/utils/api/response";

export const POST = async (request: NextRequest) => {
    try {
        const { project_name, event_type, description } = await request.json();

        if (!project_name || !event_type) {
            return nextResponse(
                { error: "project_name & event_type are missing." },
                400
            );
        }

        // 1. inserting / updating a project
        const { data: projectData, error: projectError } = (await supabaseServer
            .from("projects")
            .upsert(
                { name: project_name, last_event_at: new Date().toISOString() },
                { onConflict: "name" }
            )
            .select()) as { data: Project[]; error: PostgrestError | null };

        if (projectError) {
            console.error(projectError);
            return nextResponse({ projectError }, 400);
        }

        // 2. inserting / updating new metadata
        const { data: eventsData, error: eventsError } = (await supabaseServer
            .from("events")
            .upsert({
                type: event_type,
                description,
                project_id: projectData?.[0]?.id,
            })
            .select()) as {
            data: Event[];
            error: PostgrestError | null;
        };

        if (eventsError) {
            console.error(eventsError);
            return nextResponse({ eventsError }, 400);
        }

        return nextResponse(
            {
                message: "Successfully created an event!",
                sent: {
                    project: projectData?.[0],
                    event: eventsData?.[0],
                },
            },
            200
        );
    } catch (error) {
        console.error(error);
        return nextResponse(
            { error: "Failed sending the analytics from the SDK." },
            400
        );
    }
};

export const OPTIONS = () => {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            status: 200,
        }
    );
};
