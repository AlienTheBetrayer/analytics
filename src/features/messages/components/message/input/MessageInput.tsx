import { Editing } from "@/features/messages/components/message/input/Editing";
import { InputControls } from "@/features/messages/components/message/input/InputControls";
import { InputStatus } from "@/features/messages/components/message/input/InputStatus";
import { Replying } from "@/features/messages/components/message/input/Replying";
import { useMessageInput } from "@/features/messages/hooks/useMessageInput";
import { Input } from "@/features/ui/input/components/Input";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { deleteMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useMemo } from "react";

export type MessageInputProps = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    data: CacheAPIProtocol["messages"]["data"] | null;
    ref?: React.Ref<HTMLInputElement | null>;
    actionMessage?: CacheAPIProtocol["messages"]["data"][number];
    type: "send" | "edit" | "reply" | "forward";
    onCancel: () => void;
    onAction: () => void;
};
export const MessageInput = (props: MessageInputProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const deleteBox = useMessageBox();

    const { updateMessage, setMessage, inputRef, message, edit, isSendable } =
        useMessageInput({
            ...props,
            onDelete: deleteBox.show,
        });

    const placeholder = useMemo(() => {
        if (props.conversationData?.membership.can_send === false) {
            return "Prohibited.";
        }

        switch (props.type) {
            case "edit": {
                return "Edit...";
            }
            case "reply": {
                return "Reply...";
            }
            default: {
                return "Send...";
            }
        }
    }, [props.type, props.conversationData?.membership.can_send]);

    return (
        <div
            className={`flex relative flex-col gap-0.5 ${props.conversationData?.membership.can_send === false ? "opacity-30" : ""}`}
            inert={props.conversationData?.membership.can_send === false}
        >
            {deleteBox.render({
                children: "This message will be deleted!",
                onSelect(response) {
                    props.onCancel();
                    if (!props.actionMessage || !status) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({
                            message: [props.actionMessage],
                            user: status,
                        });
                        props.onAction();
                    }
                },
            })}

            <Editing
                type={props.type}
                actionMessage={props.actionMessage}
            />

            <Replying
                type={props.type}
                actionMessage={props.actionMessage}
            />

            <div className="flex items-center gap-1">
                <InputStatus {...props} />

                <Input
                    isEnabled={!!(props.retrieved || props.data)}
                    ref={inputRef}
                    className="bg-bg-1! border-0! outline-1! outline-transparent hover:outline-blue-1 focus-visible:outline-blue-1"
                    placeholder={placeholder}
                    value={props.type === "edit" ? edit : message}
                    onChange={(value) => setMessage(value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        switch (e.code) {
                            case "Enter": {
                                updateMessage();
                                props.onAction();
                                break;
                            }
                            case "Escape": {
                                props.onCancel();
                                break;
                            }
                        }
                    }}
                />

                <InputControls
                    {...props}
                    isSendable={isSendable}
                    updateMessage={updateMessage}
                />
            </div>
        </div>
    );
};
