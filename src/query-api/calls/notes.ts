import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertNoteboard = async (
    options: (
        | { type: "create"; title: string; description?: string }
        | {
              type: "edit";
              noteboard_id: string;
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
            ...("noteboard_id" in options && {
                noteboard_id: options.noteboard_id,
            }),
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

export const upsertNote = async (
    options: (
        | { type: "create"; title: string; checked?: boolean }
        | {
              type: "edit";
              element_id: string;
              title?: string;
              pinned?: boolean;
              checked?: boolean;
          }
    ) & { user_id: string },
) => {
    const res = await refreshedRequest({
        route: "/api/update/note",
        method: "POST",
        body: {
            type: options.type,
            user_id: options.user_id,
            title: options.title,
            ...("pinned" in options && { pinned: options.pinned }),
            ...("checked" in options && { checked: options.checked }),
        },
    });

    return res;
};
