import type { PostgrestError } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { Token } from "@/types/api/database/authentication";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const id = (await params).id;

		const { data: sessionsData, error: sessionsError } = (await supabaseServer
			.from("tokens")
			.select()
			.eq("user_id", id)) as { data: Token[]; error: PostgrestError | null };

		if (sessionsError) {
			return nextResponse(sessionsError, 400);
		}

		const refreshToken = request.cookies.get("refreshToken")?.value;

		if (refreshToken === undefined) {
			return nextResponse({ error: "Not authenticated." }, 400);
		}

		const refreshPayload = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET as string,
		) as { session_id: string; id: string; role: string };

		const sessions = sessionsData.map((s) => ({
			id: s.id,
			isCurrent: refreshPayload.session_id === s.session_id,
		}));

		return nextResponse({ sessions }, 200);
	} catch {
		return nextResponse({ error: "Failed getting the current sessions." }, 400);
	}
};
