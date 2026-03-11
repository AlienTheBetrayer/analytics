/** @format */

import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { deleteMessage } from "@/query-api/calls/messages";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";
import Image from "next/image";

export const Selectable = () => {
    // zustand
    const display = useAppStore((state) => state.display.messages);
    const messages = useAppStore((state) => state.messages);
    const conversation = useAppStore((state) => state.conversation);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    // message boxes
    const deleteBox = useMessageBox();

    // jsx
    return (
        <>
            {deleteBox.render({
                children: "Selected messages will be deleted! (allowed by permissions)",
                onSelect(response) {
                    const messages = Array.from(display.selecting.values());

                    if (!messages.length || !conversation) {
                        return;
                    }
                    if (response === "yes") {
                        deleteMessage({
                            messages,
                            conversation_id: conversation.id,
                        });
                        updateDisplay({
                            messages: {
                                selecting: new Set(),
                                selectingMode: false,
                            },
                        });
                    }
                },
            })}

            <div className="inset-0! absolute overflow-hidden">
                <motion.ul
                    className="absolute! z-2 inset-0 box gap-1! p-0! items-center! flex-row! overflow-hidden"
                    initial={{ y: "-100%", opacity: 0, scale: 0.95 }}
                    animate={{ y: "0", opacity: 1, scale: 1 }}
                    exit={{ y: "-100%", opacity: 0, scale: 0.95 }}
                    transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
                >
                    <li>
                        <span className="flex items-center gap-1 bg-bg-2 border-bg-3 border rounded-full h-8 px-4">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            <Image
                                alt=""
                                width={14}
                                height={14}
                                src="/select.svg"
                            />
                            <span>Selected: {display.selecting.size}</span>
                        </span>
                    </li>

                    <li>
                        <Tooltip
                            text="Delete"
                            isEnabled={display.selecting.size > 0}
                        >
                            <Button onClick={deleteBox.show}>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/delete.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip
                            text="Copy"
                            isEnabled={display.selecting.size > 0}
                        >
                            <Button
                                onClick={() => {
                                    wrapPromise("copySelected", () => {
                                        if (!messages?.messages.size) {
                                            return Promise.reject();
                                        }

                                        const text = Array.from(display.selecting.values()).map(
                                            (id) => messages.messages.get(id)?.message ?? "",
                                        );

                                        return navigator.clipboard.writeText(text.join("\n"));
                                    });
                                }}
                            >
                                <PromiseState state="copySelected" />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/copy.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li className="ml-auto!">
                        <Tooltip text="Cancel">
                            <Button
                                onClick={() => {
                                    updateDisplay({
                                        messages: {
                                            selecting: new Map([]),
                                            selectingMode: false,
                                        },
                                    });
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/cross.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>
                </motion.ul>
            </div>
        </>
    );
};
