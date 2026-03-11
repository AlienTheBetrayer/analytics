/** @format */

import { ExpandedConversation } from "@/query-api/protocol/messages";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    conversation: ExpandedConversation | null;
};

export const LastMessageDate = ({ conversation }: Props) => {
    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return (
        <span className="flex items-center gap-1 ml-auto! whitespace-nowrap">
            {conversation.conversation_meta?.pinned && (
                <Image
                    alt="pin"
                    width={13}
                    height={13}
                    src="/pin.svg"
                />
            )}

            {!!conversation.last_message && (
                <>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={conversation.last_message.seen_at ? "/seen.svg" : "/checkmark.svg"}
                    />
                    <small>{exactTime(conversation.last_message.created_at)}</small>
                </>
            )}
        </span>
    );
};
