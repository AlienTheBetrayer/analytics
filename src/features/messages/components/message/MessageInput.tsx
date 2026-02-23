import { useMessageInput } from "@/features/messages/hooks/useMessageInput";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export type MessageInputProps = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
    data: CacheAPIProtocol["messages"]["data"] | null;
    ref?: React.Ref<HTMLInputElement | null>;
    editingMessage?: CacheAPIProtocol["messages"]["data"][number];
    type: "send" | "edit";
    onCancel: () => void;
};
export const MessageInput = ({
    retrieved,
    data,
    ref,
    type,
    editingMessage,
    onCancel,
}: MessageInputProps) => {
    const { updateMessage, setMessage, inputRef, message, edit, isSendable } =
        useMessageInput({
            retrieved,
            data,
            ref,
            type,
            editingMessage,
            onCancel,
        });

    return (
        <div className="flex items-center gap-0.5">
            <Input
                isEnabled={!!(retrieved || data)}
                ref={inputRef}
                className="bg-bg-1!"
                placeholder={type === "edit" ? "Edit..." : "Write..."}
                value={type === "edit" ? edit : message}
                onChange={(value) => setMessage(value)}
                onKeyDown={(e: React.KeyboardEvent) => {
                    switch (e.code) {
                        case "Enter": {
                            updateMessage();
                            break;
                        }
                        case "Escape": {
                            onCancel();
                            break;
                        }
                    }
                }}
            />

            <Tooltip
                direction="top"
                text="Send a message"
                isEnabled={isSendable || type === "edit"}
            >
                <Button
                    className="not-hover:bg-bg-1! h-full! aspect-square overflow-hidden"
                    onClick={updateMessage}
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
                                    src={
                                        type === "edit"
                                            ? "/pencil.svg"
                                            : "/send.svg"
                                    }
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
                                    src={
                                        type === "edit"
                                            ? "/delete.svg"
                                            : "/cross.svg"
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </Tooltip>

            <div
                className={`overflow-hidden transition-all duration-300 shrink-0 
                    ${type === "edit" ? "max-w-8" : "max-w-0"}`}
                inert={type !== "edit"}
            >
                <Tooltip
                    direction="top"
                    text="Cancel"
                >
                    <Button
                        className="not-hover:bg-bg-1!"
                        onClick={() => {
                            onCancel?.();
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/back.svg"
                        />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
