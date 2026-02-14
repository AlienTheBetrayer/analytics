import { AuthenticationToken } from "@/types/auth/authentication";
import { Color, Profile, User } from "@/types/tables/account";
import { Token } from "@/types/tables/auth";
import { ContactMessage } from "@/types/tables/contact";
import {
    Conversation,
    Message,
    ConversationMember,
} from "@/types/tables/messages";
import { Comment, Post, PostPrivacy } from "@/types/tables/posts";
import { Event, Project } from "@/types/tables/project";

/**
 * type for values along with their respective keys
 */
export type CacheAPIProtocol = {
    // auth
    status: {
        key: ["status"];
        data: AuthenticationToken;
    };
    sessions: {
        key: ["sessions", string];
        data: Record<string, Token>;
    };

    // messsages
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

    // contact
    contact_messages: {
        key: ["contact_messages", string];
        data: string[];
    };
    contact_message: {
        key: ["contact_message", string];
        data: ContactMessage;
    };

    // relationship
    relationship: {
        key: ["relationship", string, string];
        data: {
            sent: boolean;
            received: boolean;
            friends: boolean;
            message: boolean;
        };
    };

    // posts
    posts: {
        key: ["posts", string];
        data: string[];
    };
    post: {
        key: ["post", string];
        data: Post & { has_liked: boolean; likes: number };
    };
    post_privacy: {
        key: ["post_privacy", string];
        data: PostPrivacy | null;
    };

    // comments
    comments: {
        key: ["comments", string];
        data: string[];
    };
    comment: {
        key: ["comment", string];
        data: Comment & {
            has_liked: boolean;
            has_disliked: boolean;
            likes: number;
        };
    };

    // users
    user: {
        key: ["user", string];
        data: User & { profile: Profile; post_ids: string[] };
    };
    user__username: {
        key: ["user__username", string];
        data: CacheAPIProtocol["user"]["data"];
    };

    // friends
    friends: {
        key: ["friends", string];
        data: string[];
    };

    // colors
    colors: {
        key: ["colors", string];
        data: Color[];
    };

    // friend_requests
    requests_incoming: {
        key: ["requests_incoming", string];
        data: string[];
    };
    requests_outcoming: {
        key: ["requests_outcoming", string];
        data: string[];
    };

    // dashboard
    projects: {
        key: ["projects"];
        data: Record<
            string,
            Project & {
                event_count: number;
            }
        >;
    };
    events: {
        key: ["events", string];
        data: Record<string, Event>;
    };

    // search
    search: {
        key: ["search", string, number];
        data: {
            ids: { id: string; post_ids: string[] }[];
            pages: number;
        };
    };
};
