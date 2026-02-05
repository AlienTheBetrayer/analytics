/**
 * contact_messages
 */
export type ContactMessage = {
    id: string;
    user_id: string;
    title: string;
    email: string;
    message: string;
    created_at: string;
    edited_at?: string;
};
