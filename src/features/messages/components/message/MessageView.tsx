import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { ConversationToplineInfo } from "@/features/messages/components/message/ConversationToplineInfo";
import { MessageDisplay } from "@/features/messages/components/message/MessageDisplay";
import { MessageInput } from "@/features/messages/components/message/MessageInput";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    conversation_id: string | undefined | null;
};
export const MessageView = ({ conversation_id }: Props) => {
    // won't load if we have no conversation_id
    const { data, isLoading } = useQuery({
        key: ["messages", conversation_id ?? undefined],
    });

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col justify-between gap-2 grow">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-14 loading"
                    />
                ))}
            </div>
        );
    }

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="ml-4!">
                    <ConversationToplineInfo data={data} />
                </li>

                <li className="ml-auto!">
                    <Tooltip
                        direction="top"
                        text="Re-fetch messages"
                    >
                        <Button
                            onClick={() => {
                                if (!conversation_id) {
                                    return;
                                }

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
                                width={14}
                                height={14}
                                src="/reload.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <ul className="flex flex-col-reverse gap-4 grow relative">
                {data?.messages?.length ? (
                    data.messages.map((message) => (
                        <li key={message.id}>
                            <MessageDisplay data={message} />
                        </li>
                    ))
                ) : (
                    <div className="opacity-50 pointer-events-none select-none">
                        <NoMessages />
                    </div>
                )}
            </ul>

            <MessageInput data={data} />
        </article>
    );
};
