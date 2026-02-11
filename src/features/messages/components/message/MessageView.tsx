import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { ConversationToplineInfo } from "@/features/messages/components/message/ConversationToplineInfo";
import { MessageInput } from "@/features/messages/components/message/MessageInput";
import { MessageList } from "@/features/messages/components/message/MessageList";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";

export const MessageView = () => {
    const { id: conversation_id } = useParams<{ id?: string }>();
    const { data: status } = useQuery({ key: ["status"] });

    if (!status || !conversation_id) {
        return (
            <div className="w-full h-full loading flex items-center justify-center">
                <NotSelected />
            </div>
        );
    }

    return <MessageViewId conversation_id={conversation_id} />;
};

type IdProps = {
    conversation_id: string;
};
const MessageViewId = ({ conversation_id }: IdProps) => {
    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="ml-4!">
                    <ConversationToplineInfo
                        conversation_id={conversation_id}
                    />
                </li>

                <li className="ml-auto!">
                    <Tooltip
                        direction="top"
                        text="Re-fetch messages"
                    >
                        <Button
                            onClick={() => {
                                wrapPromise("reloadMessages", async () => {
                                    return queryInvalidate({
                                        key: ["messages", conversation_id],
                                        silent: false,
                                    });
                                });
                            }}
                        >
                            <PromiseState state="reloadMessages" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/reload.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <MessageList conversation_id={conversation_id} />

            <MessageInput conversation_id={conversation_id} />
        </article>
    );
};
