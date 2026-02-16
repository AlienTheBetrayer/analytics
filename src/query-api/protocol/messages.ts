import { Profile, User } from "@/types/tables/account";
import {
    Conversation,
    Message,
    ConversationMember,
    ConversationMeta,
} from "@/types/tables/messages";

export type CacheAPIProtocolMessages = {
    conversation_retrieve: {
        key: ["conversation_retrieve", string, string, string];
        data: {
            conversation_id: string | null | undefined;
            user: (User & { profile: Profile }) | undefined;
        };
    };

    conversations: {
        key: ["conversations", string];
        data: (Conversation & {
            last_message?: Pick<
                Message,
                "message" | "seen_at" | "created_at" | "edited_at"
            >;
            conversation_members: (Pick<
                ConversationMember,
                "user_id" | "created_at"
            > & {
                user: User & { profile: Profile };
            })[];
            conversation_meta?: Pick<
                ConversationMeta,
                "archived" | "pinned" | "pinned_at"
            >;
        })[];
    };

    messages: {
        key: ["messages", string];
        data: Conversation & {
            messages: (Message & { user: User & { profile: Profile } })[];
            conversation_members: (Pick<
                ConversationMember,
                "user_id" | "created_at"
            > & {
                user: User & { profile: Profile };
            })[];
        };
    };
};
