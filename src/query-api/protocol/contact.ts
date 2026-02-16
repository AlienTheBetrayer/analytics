import { ContactMessage } from "@/types/tables/contact";

export type CacheAPIProtocolContact = {
    contact_messages: {
        key: ["contact_messages", string];
        data: string[];
    };
    contact_message: {
        key: ["contact_message", string];
        data: ContactMessage;
    };
};
