/** @format */

import { ContextMenu } from "@/features/messages/components/message/display/ContextMenu";
import { Forward } from "@/features/messages/components/message/display/parts/Forward";
import { Core } from "@/features/messages/components/message/display/parts/Core";
import { Reply } from "@/features/messages/components/message/display/parts/Reply";
import { SystemDisplay } from "@/features/messages/components/message/display/system/SystemDisplay";
import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { useMessageDisplay } from "@/features/messages/hooks/useMessageDisplay";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { AnimatePresence, motion } from "motion/react";
import { MapType } from "@/types/other/utils";
import React from "react";
import { ExpandedMessage } from "@/query-api/protocol/messages";

export type MessageDisplayProps = {
    id: string;
    onAction: (
        message: ExpandedMessage,
        type: MessageInputProps["type"],
        response?: MapType<CacheAPIProtocol["conversations"]["data"]["conversations"]>,
    ) => void;
    isSelected: boolean;
    selectionMode: boolean;
};

export const MessageDisplay = React.memo(function MessageDisplayComponent({
    id,
    onAction,
    isSelected,
    selectionMode,
}: MessageDisplayProps) {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // zustand (message object)
    const message = useAppStore((state) => state.messages?.messages.get(id));

    // selection inversion
    const { invertDisplay } = useMessageDisplay({ message });

    // fallbacks
    if (!message) {
        return null;
    }

    // system message
    switch (message.type) {
        case "system": {
            return <SystemDisplay message={message} />;
        }
    }

    // ui states
    const isOurs = message.user_id === status?.id;

    return (
        <div className="relative flex items-center min-h-11">
            <div className="w-full">
                <Modal
                    tooltipClassName="w-screen max-w-64"
                    direction={isOurs ? "left" : "right"}
                    className={`relative w-fit! ${isOurs ? "ml-auto!" : ""}`}
                    isActive={!selectionMode}
                    element={(hide) => (
                        <ContextMenu
                            hide={hide}
                            message={message}
                            onAction={onAction}
                        />
                    )}
                >
                    <Button
                        className={`box p-1.75! px-4! w-fit! flex-col! rounded-3xl!
                        ${isSelected && selectionMode ? "not-hover:bg-bg-5! hover:bg-bg-6! select-none" : "not-hover:bg-bg-1!"}
                    `}
                        onClick={() => {
                            if (!selectionMode) {
                                return;
                            }
                            invertDisplay();
                        }}
                        onPointerMove={
                            selectionMode ?
                                (e) => {
                                    if (!(e.buttons & 1)) {
                                        return;
                                    }
                                    invertDisplay("on");
                                }
                            :   undefined
                        }
                    >
                        <Reply message={message} />
                        <Forward message={message} />
                        <Core message={message} />
                    </Button>
                </Modal>
            </div>

            <AnimatePresence>
                {selectionMode && (
                    <motion.div
                        key={`checkbox_${id}`}
                        initial={{ width: 0, scale: 0 }}
                        animate={{ width: "auto", scale: 1 }}
                        exit={{ width: "0", scale: 0 }}
                        transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <Checkbox
                            className="w-fit! h-fit! bg-bg-1! justify-center! items-center! outline-0!"
                            value={isSelected}
                            onToggle={(flag) => {
                                invertDisplay(flag ? "on" : "off");
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
