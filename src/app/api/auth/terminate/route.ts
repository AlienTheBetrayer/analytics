import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const accessToken = request.cookies.get("accessToken")?.value;

		if (accessToken === undefined) {
			return nextResponse({ error: "Not logged in." }, 400);
		}

		const params = request.nextUrl.searchParams;
		const type = params.get("type") ?? "all";

		const payload = jwt.verify(
			accessToken,
			process.env.ACCESS_SECRET as string,
		) as { id: string; role: string; session_id: string };

		switch (type) {
			case "all": {
				const { error: accessError } = await supabaseServer
					.from("tokens")
					.delete()
					.eq("user_id", payload.id);

				if (accessError) {
					return nextResponse(accessError, 400);
				}
				break;
			}
			case "other": {
				const { error: accessError } = await supabaseServer
					.from("tokens")
					.delete()
					.eq("user_id", payload.id)
					.neq("session_id", payload.session_id);

				if (accessError) {
					return nextResponse(accessError, 400);
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
