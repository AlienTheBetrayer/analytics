/**
 * invitations
 */
export type Invitation = {
    id: string;
    inviter_id: string;
    conversation_id: string;
    description?: string;
    image_url?: string;
    created_at: string;
};
