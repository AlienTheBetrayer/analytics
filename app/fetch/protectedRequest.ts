import axios, { type AxiosRequestConfig } from "axios";

export const protectedRequest = async (
	route: string,
	data?: object,
	config?: AxiosRequestConfig,
) => {
	try {
		const res = await axios.post(route, data, config);
		if (res.status === 401) {
			const refreshRes = await axios.post("api/auth/refresh");

			if (refreshRes.status === 200) {
				return await axios.post(route, data, config);
			} else {
				return new Error("Not authenticated.");
			}
		} else {
			return res;
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "protected error";
		return message;
	}
};
