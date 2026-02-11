import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { MessageInput } from "@/features/messages/components/message/MessageInput";
import { MessageList } from "@/features/messages/components/message/MessageList";
import { conversationData } from "@/features/messages/utils/ui";
import { Button } from "@/features/ui/button/components/Button";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    conversation_id?: string;
};

export const MessageView = ({ conversation_id }: Props) => {
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
    // fetching (pre-fetched)
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations } = useQuery({
        key: ["conversations", status?.id],
    });

    // ui states
    const toplineData = useMemo(() => {
        return conversationData({ conversations, status, conversation_id });
    }, [conversations, status, conversation_id]);

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="flex items-center gap-1 ml-4!">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    {toplineData?.image_url && (
                        <Image
                            alt=""
                            width={256}
                            height={256}
                            src={toplineData.image_url}
                            className="rounded-full! invert-0! h-5! w-5!"
                        />
                    )}
                    <span>{toplineData?.title}</span>
                </li>

                <li className="ml-auto!">
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
                </li>
            </ul>

            <MessageList conversation_id={conversation_id} />

            <MessageInput
                whom={toplineData?.title}
                conversation_id={conversation_id}
            />
        </article>
    );
};
