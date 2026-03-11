/** @format */

import { Editing } from "@/features/messages/components/message/input/Editing";
import { InputControls } from "@/features/messages/components/message/input/InputControls";
import { InputStatus } from "@/features/messages/components/message/input/InputStatus";
import { Replying } from "@/features/messages/components/message/input/Replying";
import { useMessageInput } from "@/features/messages/hooks/useMessageInput";
import { Input } from "@/features/ui/input/components/Input";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { deleteMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";

export type MessageInputProps = {
    ref?: React.Ref<HTMLInputElement | null>;
    actionMessage?: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
    type: "send" | "edit" | "reply" | "forward";
    onCancel: () => void;
    onAction: () => void;
};
export const MessageInput = (props: MessageInputProps) => {
    // message boxes
    const deleteBox = useMessageBox();

    // functions / refs / states
    const { updateMessage, setMessage, inputRef, message, edit, isSendable, placeholder } = useMessageInput({
        ...props,
        onDelete: deleteBox.show,
    });

    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const messages = useAppStore((state) => state.messages);
    const retrieved = useAppStore((state) => state.retrieved);

    // jsx
    return (
        <div
            className={`flex relative flex-col gap-0.5 ${conversation?.membership.can_send === false ? "opacity-30" : ""}`}
            inert={conversation?.membership.can_send === false}
        >
            {deleteBox.render({
                children: "This message will be deleted!",
                onSelect(response) {
                    props.onCancel();
                    if (!props.actionMessage || !conversation) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({
                            messages: [props.actionMessage.id],
                            conversation_id: conversation.id,
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
                    isEnabled={!!(retrieved || messages)}
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
