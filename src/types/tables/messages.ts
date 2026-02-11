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
 * conversations
 */
export type Conversation = {
    id: string;
    title?: string;
    description?: string;
    type: "dm";
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
    type: "msg" | "forward";
};
