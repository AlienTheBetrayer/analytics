import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { MessageList } from "@/features/messages/components/message/MessageList";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    const conversationTitle = useMemo(() => {
        const convo = conversations?.find((c) => c.id === conversation_id);
        return (
            convo?.title ??
            convo?.conversation_members.find((m) => m.user_id !== status?.id)
                ?.user.username
        );
    }, [conversations, conversation_id, status]);

    // react states
    const [message, setMessage] = useState<string>("");
    const isSendable = !!message.trim();

    // input + auto-focusing + button showing
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const send = useCallback(() => {
        if (!message.trim()) {
            return;
        }

        setMessage("");
    }, [message]);

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="flex items-center gap-1 ml-4!">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <span>{conversationTitle}</span>
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

            <div className="flex items-center gap-1">
                <Input
                    ref={inputRef}
                    className="bg-bg-1!"
                    placeholder={`Write to ${conversationTitle}...`}
                    value={message}
                    onChange={(value) => setMessage(value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        switch (e.code) {
                            case "Enter": {
                                send();
                                break;
                            }
                        }
                    }}
                />

                <Button
                    className="not-hover:bg-bg-1! h-full! aspect-square overflow-hidden"
                    onClick={send}
                    isEnabled={isSendable}
                >
                    <AnimatePresence>
                        {isSendable ? (
                            <motion.div
                                key="sendable"
                                className="absolute"
                                initial={{ x: -20, opacity: 0, scale: 0 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: -20, opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/send.svg"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="notsendable"
                                className="absolute"
                                initial={{ x: 20, opacity: 0, scale: 0 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 20, opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/cross.svg"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
        </article>
    );
};
