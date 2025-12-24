import axios from "axios";
import type { APIResponseType } from "@/types/api/response";
import type { ResponseAxios } from "@/types/zustand/utils/axios";

export type RetrievedResponse = {
	status: "ok" | "error";
	message?: string;
	type?: APIResponseType;
};

/**
 * executes your callback (sends a request) and retrieves a response from it in a form of an RetrievedResponse object
 * @param callback a function used to perform a fetch request (preferably axios)
 * @returns a promise with an optional axios response (in case the response succeeds) and with an RetrievedResponse object
 */
export const retrieveResponse = async (
	callback: () => Promise<ResponseAxios>,
): Promise<{
	axiosResponse?: ResponseAxios;
	retrievedResponse: RetrievedResponse;
}> => {
	try {
		const response = await callback();
		return {
			axiosResponse: response,
			retrievedResponse: {
				status: "ok",
				message: response.data?.message ?? "Success!",
				type: response.data?.type ?? "unknown",
			},
		};
	} catch (error) {
		let retrievedResponse: RetrievedResponse = { status: "error" };

		if (axios.isAxiosError(error)) {
			retrievedResponse = {
				...retrievedResponse,
				message: error.response?.data?.error ?? "Error!",
				type: error.response?.data?.type ?? "unknown",
			};
		}

		return { axiosResponse: undefined, retrievedResponse };
	}
};
