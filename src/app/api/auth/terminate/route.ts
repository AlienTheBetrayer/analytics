import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const refreshToken = request.cookies.get("refreshToken")?.value;

		if (refreshToken === undefined) {
			return nextResponse({ error: "Not logged in." }, 400);
		}

		const params = request.nextUrl.searchParams;
		const type = params.get("type") ?? "all";

		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET as string,
		) as { id: string; role: string; session_id: string };

		switch (type) {
			case "all": {
				const { error: refreshError } = await supabaseServer
					.from("tokens")
					.delete()
					.eq("user_id", payload.id);

				if (refreshError) {
					return nextResponse(refreshError, 400);
				}
				break;
			}
			case "other": {
				const { error: refreshError } = await supabaseServer
					.from("tokens")
					.delete()
					.eq("user_id", payload.id)
                    .neq("session_id", payload.session_id);

				if (refreshError) {
					return nextResponse(refreshError, 400);
				}

				break;
			}
		}

		return nextResponse(
			{ message: "Successfully terminated all sessions!" },
			200,
		);
	} catch {
		return nextResponse({ error: "Failed terminating all sessions." }, 400);
	}
};
