import { Editing } from "@/features/messages/components/message/input/Editing";
import { Replying } from "@/features/messages/components/message/input/Replying";
import { useMessageInput } from "@/features/messages/hooks/useMessageInput";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { deleteMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export type MessageInputProps = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
    data: CacheAPIProtocol["messages"]["data"] | null;
    ref?: React.Ref<HTMLInputElement | null>;
    actionMessage?: CacheAPIProtocol["messages"]["data"][number];
    type: "send" | "edit" | "reply" | "forward";
    onCancel: () => void;
    onAction: () => void;
};
export const MessageInput = ({
    retrieved,
    data,
    ref,
    type,
    actionMessage,
    onCancel,
    onAction,
}: MessageInputProps) => {
    const deleteBox = useMessageBox();

    const { updateMessage, setMessage, inputRef, message, edit, isSendable } =
        useMessageInput({
            retrieved,
            data,
            ref,
            type,
            actionMessage,
            onCancel,
            onAction,
            onDelete: deleteBox.show,
        });

    return (
        <div className="flex flex-col gap-0.5">
            {deleteBox.render({
                children: "This message will be deleted!",
                onSelect(response) {
                    onCancel();
                    if (!actionMessage) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({ message: actionMessage });
                        onAction();
                    }
                },
            })}

            <Editing
                type={type}
                actionMessage={actionMessage}
            />

            <Replying
                type={type}
                actionMessage={actionMessage}
            />

            <div className="flex items-center gap-0.5">
                <div className="box p-0! flex-row! gap-0! h-full items-center justify-center w-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="flex items-center gap-0!"
                            key={type}
                            initial={{ x: 12, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -12, opacity: 0 }}
                            transition={{
                                ease: [0.4, 0, 0.2, 1],
                                duration: 0.125,
                            }}
                        >
                            <div
                                className="w-1 h-1 rounded-full"
                                style={{
                                    background:
                                        type === "edit"
                                            ? "var(--orange-1)"
                                            : type === "reply"
                                              ? "var(--blue-3)"
                                              : "var(--blue-1)",
                                }}
                            />

                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src={
                                    type === "edit"
                                        ? "/pencil.svg"
                                        : type === "reply"
                                          ? "/back.svg"
                                          : "/send.svg"
                                }
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <Input
                    isEnabled={!!(retrieved || data)}
                    ref={inputRef}
                    className="bg-bg-1! border-0! outline-1! outline-transparent hover:outline-blue-1 focus-visible:outline-blue-1"
                    placeholder={
                        type === "edit"
                            ? "Edit..."
                            : type === "reply"
                              ? "Reply..."
                              : "Write..."
                    }
                    value={type === "edit" ? edit : message}
                    onChange={(value) => setMessage(value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        switch (e.code) {
                            case "Enter": {
                                updateMessage();
                                onAction();
                                break;
                            }
                            case "Escape": {
                                onCancel();
                                break;
                            }
                        }
                    }}
                />

                <div
                    className={`overflow-hidden transition-all duration-300 shrink-0 
                    ${type !== "send" ? "max-w-8" : "max-w-0"}`}
                    inert={type === "send"}
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

                <Tooltip
                    direction="top"
                    text={
                        type === "edit"
                            ? "Edit a message"
                            : type === "send"
                              ? "Send a message"
                              : type === "reply"
                                ? "Reply"
                                : ""
                    }
                    isEnabled={isSendable || type === "edit"}
                >
                    <Button
                        className="not-hover:bg-bg-1! h-full! aspect-square overflow-hidden"
                        onClick={() => {
                            updateMessage();
                            onAction();
                        }}
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
            </div>
        </div>
    );
};
