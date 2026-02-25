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
    console.log(data.forward);
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
            element={(hide) => (
                <ContextMenu
                    hide={hide}
                    data={data}
                    onAction={onAction}
                />
            )}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.75! px-4! w-fit! flex-col! rounded-3xl!`}
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
