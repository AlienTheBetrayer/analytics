/** @format */

import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate, queryMutate } from "@/query/auxiliary";
import { queryCache } from "@/query/init";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertConversation = async (
    options:
        | {
              type: "create";
              conversation_type: string;
              member_ids: string[];
              title?: string;
              description?: string;
              image?: File | null;
          }
        | {
              type: "edit";
              conversation_id: string;
              pinned?: boolean;
              archived?: boolean;
              title?: string;
              description?: string;
              image?: File | null;
          },
) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return;
    }

    const base64 = "image" in options && options.image ? await fileToBase64(options.image) : null;

    switch (options.type) {
        case "create": {
            const res = await refreshedRequest({
                route: "/api/update/conversation",
                method: "POST",
                body: {
                    user_id: user.id,
                    type: options.type,
                    ...("title" in options && { title: options.title }),
                    ...("description" in options && {
                        description: options.description,
                    }),
                    ...("image" in options && {
                        image: base64,
                        image_name: options.image?.name,
                        image_type: options.image?.type,
                    }),
                    member_ids: options.member_ids.join(","),
                    conversation_type: options.conversation_type,
                },
            });

            queryInvalidate({ key: ["conversations", user.id] });

            return res;
        }
        case "edit": {
            queryMutate({
                key: ["conversations", user.id],
                value: (state) => {
                    const conversations = new Map(state.conversations);

                    const c = conversations.get(options.conversation_id);

                    if (!c) {
                        return state;
                    }

                    conversations.set(options.conversation_id, {
                        ...c,
                        ...(typeof options.title === "string" && {
                            title: options.title,
                        }),
                        ...(typeof options.description === "string" && {
                            description: options.description,
                        }),
                        ...("image" in options && {
                            image_url: options.image ? URL.createObjectURL(options.image) : undefined,
                        }),
                        conversation_meta: {
                            ...(c.conversation_meta ?? {}),
                            ...(typeof options.pinned === "boolean" && {
                                pinned: options.pinned,
                                pinned_at: new Date().toISOString(),
                            }),
                            ...(typeof options.archived === "boolean" && {
                                archived: options.archived,
                            }),
                        },
                    });

                    return { ...state, conversations };
                },
            });

            const res = await refreshedRequest({
                route: "/api/update/conversation",
                method: "POST",
                body: {
                    user_id: user.id,
                    conversation_id: options.conversation_id,
                    type: options.type,
                    ...("image" in options && {
                        image: base64,
                        image_name: options.image?.name,
                        image_type: options.image?.type,
                    }),
                    ...("title" in options && { title: options.title }),
                    ...("description" in options && {
                        description: options.description,
                    }),
                    ...("pinned" in options && { pinned: options.pinned }),
                    ...("archived" in options && {
                        archived: options.archived,
                    }),
                },
            });

            queryInvalidate({ key: ["conversations", user.id] });

            return res;
        }
    }
};

export const deleteConversation = async (options: {
    conversation_id: string;
    type: "leave" | "delete-all" | "clear-history";
}) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return;
    }

    switch (options.type) {
        case "clear-history": {
            queryMutate({
                key: ["conversations", user.id],
                value: (state) => {
                    const conversations = new Map(state.conversations);

                    const c = conversations.get(options.conversation_id);

                    if (!c) {
                        return state;
                    }

                    conversations.set(c.id, { ...c, last_message: undefined });

                    return { ...state, conversations };
                },
            });
            break;
        }
        default: {
            queryMutate({
                key: ["conversations", user.id],
                value: (state) => {
                    const conversations = new Map(state.conversations);
                    const ids = state.ids.filter((id) => id !== options.conversation_id);
                    conversations.delete(options.conversation_id);

                    return { ...state, ids, conversations };
                },
            });
            break;
        }
    }

    queryMutate({
        key: ["messages", options.conversation_id],
        value: () => {
            return { ids: [], messages: new Map(), users: new Map() };
        },
    });

    const res = await refreshedRequest({
        route: "/api/delete/conversation",
        method: "POST",
        body: {
            ...options,
            user_id: user.id,
        },
    });

    return res;
};
