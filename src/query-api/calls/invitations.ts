import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import { AuthenticationToken } from "@/types/auth/authentication";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const createInvitation = async (options: {
    description?: string;
    image?: File;
    user: AuthenticationToken;
    conversation_id: string;
}) => {
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
            user_id: options.user.id,
        },
    });
};

export const deleteInvitation = async (options: {
    user: AuthenticationToken;
    invitation: CacheAPIProtocol["invitations"]["data"][number];
}) => {
    queryMutate({
        key: ["invitations", options.invitation.conversation_id],
        value: (state) => state.filter((i) => i.id !== options.invitation.id),
    });

    const res = await refreshedRequest({
        route: "/api/delete/invitation",
        method: "POST",
        body: {
            user_id: options.user.id,
            invitation_id: options.invitation.id,
        },
    });

    return res;
};
