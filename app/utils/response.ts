import { NextResponse } from "next/server";

export const nextResponse = <T extends object>(data: T, status = 200) => {
	return NextResponse.json(data, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		status,
	});
};
