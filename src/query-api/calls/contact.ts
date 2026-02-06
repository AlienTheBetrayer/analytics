import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryDelete, queryMutate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const updateContact = async (
    options:
        | {
              type: "send";
              user_id: string;
              title: string;
              email: string;
              message: string;
          }
        | {
              type: "edit";
              message_id: string;
              title?: string;
              email?: string;
              message?: string;
              response?: string | null;
          },
) => {
    const message = (
        await refreshedRequest({
            route: "/api/update/contact",
            method: "POST",
            body: {
                type: options.type,
                ...("user_id" in options && { user_id: options.user_id }),
                message_id: options.type === "edit" && options.message_id,
                data: {
                    title: options.title,
                    email: options.email,
                    message: options.message,
                    ...("response" in options && { response: options.response}),
                },
            },
        })
    ).data.message as CacheAPIProtocol["contact_message"]["data"];

    if (options.type === "send") {
        queryMutate({
            key: ["contact_messages"],
            value: (value) => [message.id, ...(value ?? [])],
        });

        queryMutate({
            key: ["contact_messages", options.user_id],
            value: (value) => [message.id, ...(value ?? [])],
        });
    }

    queryMutate({ key: ["contact_message", message.id], value: message });

    return message;
};

export const deleteContact = async (options: {
    user_id: string;
    message_id: string;
}) => {
    const res = await refreshedRequest({
        route: "/api/delete/contact",
        method: "POST",
        body: {
            user_id: options.user_id,
            message_id: options.message_id,
        },
    });

    queryMutate({
        key: ["contact_messages"],
        value: (value) => value.filter((id) => id !== options.message_id),
    });
    queryMutate({
        key: ["contact_messages", options.user_id],
        value: (value) => value.filter((id) => id !== options.message_id),
    });
    queryDelete({ key: ["contact_message", options.message_id] });

    return res;
};
