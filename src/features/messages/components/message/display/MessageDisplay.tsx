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
    const selecting = useAppStore((state) => state.display.messages.selecting);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    // fallbacks
    switch (data.type) {
        case "system": {
            return <SystemDisplay data={data} />;
        }
    }

    const isOurs = data.user_id === status?.id;

    return (
        <Modal
            direction={isOurs ? "left" : "right"}
            className={`relative w-fit! ${isOurs ? "ml-auto!" : ""}`}
            isActive={selecting.size === 0}
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
                    ${selecting.has(data.id) ? "not-hover:bg-bg-4! hover:bg-bg-5!" : "not-hover:bg-bg-1!"}`}
                onClick={() => {
                    if (!selecting.size) {
                        return;
                    }

                    updateDisplay({
                        messages: {
                            selecting: (() => {
                                const map = new Map(selecting);

                                if (map.has(data.id)) {
                                    map.delete(data.id);
                                } else {
                                    map.set(data.id, data);
                                }

                                return map;
                            })(),
                        },
                    });
                }}
            >
                <Reply data={data} />
                <Forward data={data} />

                <Core
                    data={data}
                    conversationData={conversationData}
                />
            </Button>
        </Modal>
    );
};
