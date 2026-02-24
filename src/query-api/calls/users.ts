import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { notificationListeners } from "@/notifications/data/init";
import { queryInvalidate } from "@/query/auxiliary";
import { AuthenticationRole } from "@/types/auth/authentication";
import { ProfileGender } from "@/types/tables/account";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const modifyFriendship = async (options: {
    from_id: string;
    to_id?: string;
    type:
        | "request-send"
        | "request-accept"
        | "request-reject"
        | "unfriend"
        | "unfriend-all";
}) => {
    const res = await refreshedRequest({
        route: "/api/update/friend/",
        method: "POST",
        body: {
            from_id: options.from_id,
            to_id: options.to_id,
            type: options.type ?? "request-send",
        },
    });

    if (options.to_id) {
        queryInvalidate({
            key: ["relationship", options.from_id, options.to_id],
        });
        queryInvalidate({
            key: ["requests_incoming", options.from_id],
        });
        queryInvalidate({
            key: ["requests_outcoming", options.from_id],
        });
    }

    if (options.type === "unfriend" || options.type === "unfriend-all") {
        queryInvalidate({ key: ["friends", options.from_id] });
    }

    return res;
};

export const updateUser = async (options: {
    id: string;
    username: string;
    data: {
        name?: string;
        title?: string;
        status?: string;
        bio?: string;
        colors?: { slot: number; color: string }[];
        color?: string;
        gender?: ProfileGender;
        image?: File | null;
        role?: AuthenticationRole;
        password?: string;
        username?: string;
    };
}) => {
    const base64 = options.data.image
        ? await fileToBase64(options.data.image)
        : null;

    const res = await refreshedRequest({
        route: "/api/update/user",
        method: "POST",
        body: {
            user_id: options.id,
            ...options.data,
            ...("image" in options.data && {
                image: base64,
                image_name: options.data.image?.name,
                image_type: options.data.image?.type,
            }),
        },
    });

    queryInvalidate({ key: ["user", options.id] });
    queryInvalidate({ key: ["user__username", options.username] });

    if (
        options.data.role ||
        options.data.username ||
        options.data.color ||
        "image" in options.data
    ) {
        queryInvalidate({ key: ["status"] });
    }

    if (options.data.colors) {
        queryInvalidate({ key: ["colors", options.id] });
    }

    notificationListeners.fire({
        key: "all",
        notification: {
            status: "Information",
            tab: "Account",
            title: "Profile modified!",
            description: "You have modified your own profile data",
            type: "Profile modified",
        },
    });

    return res;
};
