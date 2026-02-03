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
            throw "project_name & event_type are missing.";
        }

        // project
        const { data: projectData, error: projectError } = (await supabaseServer
            .from("projects")
            .upsert(
                { name: project_name, last_event_at: new Date().toISOString() },
                { onConflict: "name" },
            )
            .select()) as {
            data: Project[];
            error: PostgrestError | null;
        };

        if (projectError) {
            throw projectError;
        }

        // event
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
            throw eventsError;
        }

        return nextResponse(
            {
                success: true,
                sent: {
                    project: projectData?.[0],
                    event: eventsData?.[0],
                },
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
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
        },
    );
};
