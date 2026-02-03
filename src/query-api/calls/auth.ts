import { notificationListeners } from "@/notifications/data/init";
import { queryDelete, queryInvalidate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios, { AxiosError } from "axios";

export const applicationLogin = async (options: {
    username: string;
    password: string;
}) => {
    try {
        const res = await axios.post("/api/auth/login", { ...options });

        queryInvalidate({ key: ["status"] });

        return res;
    } catch (error) {
        return (error as AxiosError).response;
    }
};

export const applicationLogout = async () => {
    const res = await axios.post("/api/auth/logout");
    queryDelete({ key: ["status"] });

    return res;
};

export const applicationSignup = async (options: {
    username: string;
    password: string;
}) => {
    try {
        const res = await axios.post("/api/auth/signup", { ...options });

        notificationListeners.fire({
            key: "all",
            notification: {
                status: "Information",
                tab: "Account",
                title: "Account registered!",
                description:
                    "You have just successfully registered a new account!",
                type: "Signed up",
            },
        });

        return res;
    } catch (error) {
        return (error as AxiosError).response;
    }
};

export const terminateSessions = async (options: {
    user_id: string;
    session_ids: string[];
}) => {
    const res = await refreshedRequest({
        route: "/api/auth/terminate",
        method: "POST",
        body: { ...options },
    });

    queryInvalidate({ key: ["sessions", options.user_id] });

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Warning",
            tab: "Account",
            title: "Sessions terminated!",
            description:
                "Now you only have one session remaining (the current one)",
            type: "Sessions terminated",
        },
    });

    return res;
};

export const deleteUser = async (options: { user_id: string }) => {
    const res = await refreshedRequest({
        route: "/api/auth/delete",
        method: "POST",
        body: {
            user_id: options.user_id,
        },
    });

    queryDelete({ key: ["user", options.user_id] });
    queryDelete({ key: ["status"] });

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Error",
            tab: "Account",
            title: "Account terminated",
            description: "You have just deleted your own account. Forever!",
            type: "Account deleted",
        },
    });

    return res;
};
