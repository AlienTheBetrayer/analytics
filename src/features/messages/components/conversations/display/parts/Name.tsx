/** @format */

import { ExpandedConversation } from "@/query-api/protocol/messages";
import Image from "next/image";

type Props = {
    conversation: ExpandedConversation;
};

export const Name = ({ conversation }: Props) => {
    switch (conversation.type) {
        case "dm": {
            return <span className="truncate">{conversation.title || conversation.peer?.username}</span>;
        }
        case "group": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/friends.svg"
                    />
                    <span>{conversation.title || "Group"}</span>
                </span>
            );
        }
        case "channel": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/menu.svg"
                    />
                    <span>{conversation.title || "Channel"}</span>
                </span>
            );
        }
        case "notes": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <span>{conversation.title || "Notes"}</span>
                </span>
            );
        }
        default: {
            return <span>Unknown</span>;
        }
    }
};
