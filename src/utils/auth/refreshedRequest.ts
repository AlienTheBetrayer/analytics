/* eslint-disable @typescript-eslint/no-unused-vars */
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
    config?: AxiosRequestConfig
) => {
    try {
        // attempts to perform a request
        const res = await axios.request({
            url: route,
            data,
            method: type,
            ...config,
        });
        return res;
    } catch (error) {
        console.error(error);
        try {
            // if internal check fails, we try to refresh the token and attempt it again
            const res = await axios.post("/api/auth/refresh");
            return await axios.request({
                url: route,
                data,
                method: type,
                ...config,
            });
        } catch (error) {
            console.error(error);
            // ultimately if it fails the second time we halt the connection
            throw new Error("Not authenticated.");
        }
    }
};
