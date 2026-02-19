import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { upsertMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useRef, useEffect, useCallback, useState } from "react";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
    data: CacheAPIProtocol["messages"]["data"] | null;
};

export const MessageInput = ({ retrieved, data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { tab } = useParams<{ tab?: string }>();

    // react states
    const [message, setMessage] = useState<string>("");

    // ui states
    const isSendable = !!message.trim();

    // input + auto-focusing + button showing
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // API
    const send = useCallback(() => {
        if (!message.trim() || !status) {
            return;
        }

        const cid = data?.id ?? retrieved?.conversation_id;

        if (cid) {
            upsertMessage({
                type: "send",
                user: status,
                conversation_id: cid,
                message,
            });
        } else {
            const to_id = tab === "notes" ? "notes" : retrieved?.user?.id;

            if (!to_id) {
                return;
            }

            upsertMessage({
                type: "start_dm",
                user: status,
                to_id,
                message,
            }).then((message) => {
                if (tab === "notes") {
                    return;
                }

                redirect(`/messages/c/${message.conversation_id}`);
            });
        }

        setMessage("");
    }, [message, status, retrieved, data, setMessage, tab]);

    return (
        <div className="flex items-center gap-1">
            <Input
                isEnabled={!!(retrieved || data)}
                ref={inputRef}
                className="bg-bg-1!"
                placeholder={`Write...`}
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

            <Tooltip
                direction="top"
                text="Send a message"
                isEnabled={isSendable}
            >
                <Button
                    className="not-hover:bg-bg-1! h-full! aspect-square overflow-hidden"
                    onClick={send}
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
            </Tooltip>
        </div>
    );
};
