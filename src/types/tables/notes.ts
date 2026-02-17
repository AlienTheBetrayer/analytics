/**
 * noteboards
 */
export type Noteboard = {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    pinned: boolean;
    pinned_at?: string;
    edited_at?: string;
    created_at: string;
}

/**
 * noteboard_elements
 */
export type NoteboardElement = {
    id: string;
    noteboard_id: string;
    title: string;
    checked: boolean;
    pinned: boolean;
    pinned_at?: string;
    edited_at?: string;
    created_at: string;
}