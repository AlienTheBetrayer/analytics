/**
 * conversation_members
 */
export type ConversationMember = {
    id: string;
    conversation_id: string;
    user_id: string;
    created_at: string;
};

/**
 * conversation_meta
 */
export type ConversationMeta = {
    id: string;
    user_id: string;
    conversation_id: string;
    pinned?: boolean;
    archived?: boolean;
    created_at: string;
    pinned_at?: string;
};

/**
 * conversations
 */
export type Conversation = {
    id: string;
    type: "dm" | "group" | "notes" | "channel";
    title?: string;
    description?: string;
    image_url?: string;
    created_at: string;
    edited_at?: string;
};

/**
 * messages
 */
export type Message = {
    id: string;
    message: string;
    conversation_id: string;
    user_id: string;
    created_at: string;
    edited_at?: string;
    seen_at?: string;
    type: "msg" | "forward" | "loading" | "system" | "reply";
};
