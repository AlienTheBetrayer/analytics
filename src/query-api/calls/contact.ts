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
              user_id: string;
              message_id: string;
              title?: string;
              email?: string;
              message?: string;
          },
) => {
    const res = await refreshedRequest({
        route: "/api/update/contact",
        method: "POST",
        body: {
            type: options.type,
            user_id: options.user_id,
            message_id: options.type === "edit" && options.message_id,
            data: {
                title: options.title,
                email: options.email,
                message: options.message,
            },
        },
    });

    return res;
};
