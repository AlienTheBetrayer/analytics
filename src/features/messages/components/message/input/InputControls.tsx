/** @format */

import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { useMessageInput } from "@/features/messages/hooks/useMessageInput";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export const InputControls = (
    props: MessageInputProps & Pick<ReturnType<typeof useMessageInput>, "updateMessage" | "isSendable">,
) => {
    return (
        <>
            <div
                className={`overflow-hidden transition-all duration-300 shrink-0 
                    ${props.type !== "send" ? "max-w-8" : "max-w-0"}`}
                inert={props.type === "send"}
            >
                <Tooltip
                    direction="top"
                    text="Cancel"
                >
                    <Button
                        className="not-hover:bg-bg-1!"
                        onClick={() => {
                            props.onCancel?.();
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
                    props.type === "edit" ? "Edit a message"
                    : props.type === "send" ?
                        "Send a message"
                    : props.type === "reply" ?
                        "Reply"
                    :   ""
                }
                isEnabled={props.isSendable || props.type === "edit"}
            >
                <Button
                    className="not-hover:bg-bg-1! h-full! aspect-square overflow-hidden"
                    onClick={() => {
                        props.updateMessage();
                        props.onAction();
                    }}
                >
                    <AnimatePresence>
                        {props.isSendable ?
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
                                    src={props.type === "edit" ? "/pencil.svg" : "/send.svg"}
                                />
                            </motion.div>
                        :   <motion.div
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
                                    src={props.type === "edit" ? "/delete.svg" : "/cross.svg"}
                                />
                            </motion.div>
                        }
                    </AnimatePresence>
                </Button>
            </Tooltip>
        </>
    );
};
