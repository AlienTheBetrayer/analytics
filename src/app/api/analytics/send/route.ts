import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { Aggregate, Event, Project } from "@/types/tables/project";
import { nextResponse } from "@/utils/api/response";

export const POST = async (request: NextRequest) => {
    try {
        const { project_name, event_type, description } = await request.json();

        if (project_name === undefined || event_type === undefined) {
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
        const { error: eventsError } = (await supabaseServer
            .from("events")
            .upsert({
                type: event_type,
                description,
                project_id: projectData[0].id,
            })
            .select()) as {
            data: Event[];
            error: PostgrestError | null;
        };

        if (eventsError) {
            console.error(eventsError);
            return nextResponse({ eventsError }, 400);
        }

        // 3. inserting / updating a project aggregate
        const { data: projectAggregatesData, error: projectAggregatesError } =
            (await supabaseServer
                .from("aggregates")
                .select()
                .eq("id", projectData[0].id)) as {
                data: Aggregate[];
                error: PostgrestError | null;
            };

        if (projectAggregatesError) {
            console.error(projectAggregatesError);
            return nextResponse({ projectAggregatesError }, 400);
        }

        const { error: aggregatesError } = await supabaseServer
            .from("aggregates")
            .upsert(
                {
                    project_id: projectData[0].id,

                    visits:
                        event_type === "page_view"
                            ? (projectAggregatesData?.[0]?.visits ?? 0) + 1
                            : (projectAggregatesData?.[0]?.visits ?? 0),
                },
                { onConflict: "id" }
            );

        if (aggregatesError) {
            console.error(aggregatesError);
            return nextResponse({ aggregatesError }, 400);
        }

        return nextResponse({ message: "Successfully created an event!" }, 200);
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
