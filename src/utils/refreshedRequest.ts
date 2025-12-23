import axios, { type AxiosRequestConfig } from "axios";

type RefreshedRequestAllowedType = "POST" | "GET";

/**
 * Sends a request that will automatically refresh the authentication token and retries the request
 * @param route an api route
 * @param data json data object
 * @param type request type (POST / GET)
 * @param config axios config
 * @returns a promise containing the axios response
 */
export const refreshedRequest = async (
	route: string,
	type: RefreshedRequestAllowedType = "POST",
	data?: object,
	config?: AxiosRequestConfig,
) => {
	try {
		switch (type) {
			case "GET":
				return await axios.get(route, config);
			case "POST":
				return await axios.post(route, data, config);
		}
	} catch {
		try {
			await axios.post("api/auth/refresh");
			return await axios.post(route, data, config);
		} catch {
			throw new Error("Not authenticated.");
		}
	}
};
