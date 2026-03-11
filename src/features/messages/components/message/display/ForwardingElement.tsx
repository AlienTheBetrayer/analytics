/** @format */

import { Avatar } from "@/features/messages/components/conversations/display/parts/Avatar";
import { ForwardingProps } from "@/features/messages/components/message/display/Forwarding";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    conversationId: string;
    onAction: ForwardingProps["onAction"];
};

export const ForwardingElement = ({ conversationId, onAction }: Props) => {
    // zustand
    const conversation = useAppStore((state) => state.conversations?.conversations.get(conversationId));

    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return (
        <Button
            className="w-full justify-start! text-left grid! grid-cols-[3rem_2fr_auto] p-2!"
            onClick={() => {
                onAction(conversation);
            }}
        >
            <Avatar
                conversation={conversation}
                className="w-8! h-8!"
            />
            <span className="truncate">{conversation.title ? conversation.title : <small>No title</small>}</span>

            {conversation.last_message ?
                <small className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <span>{relativeTime(conversation.last_message.created_at)}</span>
                </small>
            :   <small className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/plus.svg"
                    />
                    <span>{relativeTime(conversation.created_at)}</span>
                </small>
            }
        </Button>
    );
};
