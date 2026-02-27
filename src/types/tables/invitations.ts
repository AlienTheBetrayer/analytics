/**
 * invitations
 */
export type Invitation = {
    id: string;
    inviter_id: string;
    conversation_id: string;
    description?: string;
    created_at: string;
    edited_at?: string;
};
