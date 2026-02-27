import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
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
