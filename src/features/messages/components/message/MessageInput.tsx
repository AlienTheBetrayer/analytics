import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useEffect, useCallback, useState } from "react";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
};

export const MessageInput = ({ data }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

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

        // sendMessage({
        //     type: "send",
        //     from_id: status.id,
        //     id,
        //     message,
        // });
        setMessage("");
    }, [message, setMessage, status]);

    return (
        <div className="flex items-center gap-1">
            <Input
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
    );
};
