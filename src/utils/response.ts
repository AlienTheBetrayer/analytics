import { NextResponse } from "next/server";
import type { APIResponseType } from "../types/api/response";

/**
 * Sends a next response with data and response type + allowed from other servers
 * @param data json body object
 * @param status status code
 * @param responseType custom api response type used to handle errors
 * @returns NextResponse object
 */
export const nextResponse = <T extends object>(
	data: T,
	status = 200,
	responseType?: APIResponseType,
) => {
	return NextResponse.json(
		{ ...data, type: responseType },
		{
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
			status,
		},
	);
};
