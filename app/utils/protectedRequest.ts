import axios, { type AxiosRequestConfig } from "axios";

export const protectedRequest = async (
	route: string,
	data?: object,
	config?: AxiosRequestConfig,
) => {
	try {
		const res = await axios.post(route, data, config);
		console.log("1");
		return res;
	} catch {
		try {
			await axios.post("api/auth/refresh");
			console.log("2");

			return await axios.post(route, data, config);
		} catch {
			throw new Error("Not authenticated.");
		}
	}
};
