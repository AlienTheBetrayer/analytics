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

export type MessageDisplayProps = {
    data: CacheAPIProtocol["messages"]["data"][number];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    onAction: (
        type: MessageInputProps["type"],
        response?: {
            conversation?: CacheAPIProtocol["conversations"]["data"][number];
        },
    ) => void;
};

export const MessageDisplay = ({
    data,
    conversationData,
    onAction,
}: MessageDisplayProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const isSelected = useAppStore((state) =>
        state.display.messages.selecting.has(data.id),
    );
    const selectingMode = useAppStore(
        (state) => state.display.messages.selectingMode,
    );

    const isOurs = data.user_id === status?.id;

    const { invertDisplay } = useMessageDisplay({ data });

    // fallbacks
    switch (data.type) {
        case "system": {
            return <SystemDisplay data={data} />;
        }
    }

    return (
        <div className="relative flex items-center">
            <div className="w-full">
                <Modal
                    tooltipClassName="w-screen max-w-64"
                    direction={isOurs ? "left" : "right"}
                    className={`relative w-fit! ${isOurs ? "ml-auto!" : ""}`}
                    isActive={!selectingMode}
                    element={(hide) => (
                        <ContextMenu
                            hide={hide}
                            data={data}
                            onAction={onAction}
                        />
                    )}
                >
                    <Button
                        className={`box p-1.75! px-4! w-fit! flex-col! rounded-3xl!
                        ${isSelected && selectingMode ? "not-hover:bg-bg-5! hover:bg-bg-6! select-none" : "not-hover:bg-bg-1!"}
                    `}
                        onClick={() => {
                            if (!selectingMode) {
                                return;
                            }
                            invertDisplay();
                        }}
                        onPointerMove={
                            selectingMode
                                ? (e) => {
                                      if (!(e.buttons & 1)) {
                                          return;
                                      }
                                      invertDisplay("on");
                                  }
                                : undefined
                        }
                    >
                        <Reply data={data} />
                        <Forward data={data} />

                        <Core
                            data={data}
                            conversationData={conversationData}
                        />
                    </Button>
                </Modal>
            </div>

            <AnimatePresence>
                {selectingMode && (
                    <motion.div
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
};
