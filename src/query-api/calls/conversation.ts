import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate, queryMutate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertConversation = async (
    options: (
        | {
              type: "create";
              conversation_type: string;
              member_ids: string[];
              title?: string;
              description?: string;
          }
        | {
              type: "edit";
              conversation_id: string;
              pinned?: boolean;
              archived?: boolean;
              title?: string;
              description?: string;
          }
    ) & { user: CacheAPIProtocol["status"]["data"] },
) => {
    switch (options.type) {
        case "create": {
            const res = await refreshedRequest({
                route: "/api/update/conversation",
                method: "POST",
                body: {
                    user_id: options.user.id,
                    type: options.type,
                    ...("title" in options && { title: options.title }),
                    ...("description" in options && {
                        description: options.description,
                    }),
                    member_ids: options.member_ids.join(","),
                    conversation_type: options.conversation_type,
                },
            });

            queryInvalidate({ key: ["conversations", options.user.id] });

            return res;
        }
        case "edit": {
            queryMutate({
                key: ["conversations", options.user.id],
                value: (state) =>
                    state.map((s) =>
                        s.id === options.conversation_id
                            ? {
                                  ...s,
                                  ...(typeof options.title === "string" && {
                                      title: options.title,
                                  }),
                                  ...(typeof options.description ===
                                      "string" && {
                                      description: options.description,
                                  }),
                                  conversation_meta: {
                                      ...s.conversation_meta,
                                      ...(typeof options.pinned ===
                                          "boolean" && {
                                          pinned: options.pinned,
                                          pinned_at: new Date().toISOString(),
                                      }),
                                      ...(typeof options.archived ===
                                          "boolean" && {
                                          archived: options.archived,
                                      }),
                                  },
                              }
                            : s,
                    ),
            });

            const res = await refreshedRequest({
                route: "/api/update/conversation",
                method: "POST",
                body: {
                    user_id: options.user.id,
                    conversation_id: options.conversation_id,
                    type: options.type,
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

            return res;
        }
    }
};

export const deleteConversation = async (options: {
    user_id: string;
    conversation_id: string;
    type: "leave" | "delete-all";
}) => {
    const res = await refreshedRequest({
        route: "/api/delete/conversation",
        method: "POST",
        body: {
            ...options,
        },
    });

    queryInvalidate({ key: ["conversations", options.user_id] });

    return res;
};
