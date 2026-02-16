import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertNoteboard = async (
    options: (
        | { type: "create"; title: string; description?: string }
        | {
              type: "edit";
              title?: string;
              description?: string;
              pinned?: boolean;
          }
    ) & { user_id: string },
) => {
    const res = await refreshedRequest({
        route: "/api/update/noteboard",
        method: "POST",
        body: {
            type: options.type,
            user_id: options.user_id,
            ...("title" in options && { title: options.title }),
            ...("description" in options && {
                description: options.description,
            }),
            ...("pinned" in options && { pinned: options.pinned }),
        },
    });

    return res;
};

export const deleteNoteboard = async (options: {
    user_id: string;
    noteboard_id: string;
}) => {
    const res = await refreshedRequest({
        route: "/api/delete/noteboard",
        method: "POST",
        body: {
            ...options,
        },
    });

    return res;
};
