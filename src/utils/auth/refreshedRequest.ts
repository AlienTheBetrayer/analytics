/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { type AxiosRequestConfig } from "axios";

/**
 * Sends a request that will automatically refresh the authentication token and retries the request
 * @param route an api route
 * @param body json data object
 * @param type request type (POST / GET)
 * @param config axios config
 * @returns a promise containing the axios response
 */
export const refreshedRequest = async (config: {
    route: string;
    method: "GET" | "POST";
    body?: object;
    config?: AxiosRequestConfig;
}) => {
    try {
        // attempts to perform a request
        const res = await axios.request({
            url: config.route,
            data: config.body,
            method: config.method ?? "GET",
            ...(config?.config ?? {}),
        });
        return res;
    } catch (error) {
        console.error(error);
        try {
            // if internal check fails, we try to refresh the token and attempt it again
            const res = await axios.post("/api/auth/refresh");
            return await axios.request({
                url: config.route,
                data: config.body,
                method: config.method ?? "GET",
                ...(config?.config ?? {}),
            });
        } catch (error) {
            // ultimately if it fails the second time we halt the connection
            console.error(error);
            throw new Error("Not authenticated.");
        }
    }
};
