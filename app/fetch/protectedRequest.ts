import axios, { type AxiosRequestConfig } from "axios";

export const protectedRequest = async (
	route: string,
	data?: object,
	config?: AxiosRequestConfig,
) => {
	try {
		const res = await axios.post(route, data, config);
		return res;
	} catch {
		try {
			await axios.post("api/auth/refresh");
			return await axios.post(route, data, config);
		} catch {
			return new Error("Not authenticated.");
		}
	}
};
