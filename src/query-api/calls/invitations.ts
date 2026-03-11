/** @format */

import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import { queryCache } from "@/query/init";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const createInvitation = async (options: { description?: string; image?: File; conversation_id: string }) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return Promise.reject();
    }

    const base64 = options.image && (await fileToBase64(options.image));

    return await refreshedRequest({
        method: "POST",
        route: "/api/update/invitation",
        body: {
            description: options.description,
            ...(base64 &&
                options.image && {
                    image: base64,
                    image_name: options.image.name,
                    image_type: options.image.type,
                }),
            conversation_id: options.conversation_id,
            user_id: user.id,
        },
    });
};

export const deleteInvitation = async (options: { invitation: CacheAPIProtocol["invitations"]["data"][number] }) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return Promise.reject();
    }

    queryMutate({
        key: ["invitations", options.invitation.conversation_id],
        value: (state) => state.filter((i) => i.id !== options.invitation.id),
    });

    const res = await refreshedRequest({
        route: "/api/delete/invitation",
        method: "POST",
        body: {
            user_id: user.id,
            invitation_id: options.invitation.id,
        },
    });

    return res;
};
