/** @format */

import { PromiseState } from "@/promises/components/PromiseState";
import "../ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { deleteMessage } from "@/query-api/calls/messages";
import { useQuery } from "@/query/core";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Forwarding } from "@/features/messages/components/message/display/Forwarding";
import { MessageDisplayProps } from "@/features/messages/components/message/display/MessageDisplay";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { useAppStore } from "@/zustand/store";
import { MapType } from "@/types/other/utils";

type Props = {
    hide?: () => void;
    onAction?: MessageDisplayProps["onAction"];
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const ContextMenu = ({ message, hide, onAction }: Props) => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // zustand
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const conversation = useAppStore((state) => state.conversation);

    // message boxes
    const deleteBox = useMessageBox();

    // ui states
    const isOurs = message.user_id === status?.id;

    // jsx
    return (
        <>
            {deleteBox.render({
                children: "This message will be deleted!",
                onSelect(response) {
                    if (!conversation) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({
                            messages: [message.id],
                            conversation_id: conversation.id,
                        });
                    }
                    hide?.();
                },
            })}

            <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-full message-ctx">
                <li className="flex items-center gap-1 mb-6! self-center">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/settings.svg"
                    />
                </li>

                {message.type !== "system" && (
                    <>
                        <li>
                            <Button
                                isEnabled={conversation?.membership.can_send !== false}
                                onClick={() => {
                                    onAction?.(message, "reply");
                                    hide?.();
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/back.svg"
                                />
                                <span>Reply</span>
                            </Button>
                        </li>

                        {isOurs && (
                            <li>
                                <Button
                                    isEnabled={conversation?.membership.can_send !== false}
                                    onClick={() => {
                                        onAction?.(message, "edit");
                                        hide?.();
                                    }}
                                >
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/pencil.svg"
                                    />
                                    <span>Edit</span>
                                </Button>
                            </li>
                        )}
                    </>
                )}

                <li>
                    <Button
                        onClick={() => {
                            wrapPromise("saveClipboard", () => {
                                return navigator.clipboard.writeText(message.message);
                            });
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/copy.svg"
                        />
                        <span className="flex items-center gap-1">
                            <PromiseState state="saveClipboard" />
                            <span>Copy</span>
                        </span>
                    </Button>
                </li>

                {message.type !== "system" && (
                    <>
                        <li>
                            <Modal
                                blur
                                tooltipClassName="w-screen max-w-96"
                                direction="screen-middle"
                                className="w-full"
                                element={(hide2) => (
                                    <Forwarding
                                        onAction={(conversation) => {
                                            onAction?.(message, "forward", conversation);
                                            hide?.();
                                            hide2();
                                        }}
                                    />
                                )}
                            >
                                <Button>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/arrow.svg"
                                    />
                                    <span>Forward</span>
                                </Button>
                            </Modal>
                        </li>

                        <li>
                            <Button
                                onClick={() => {
                                    updateDisplay({
                                        messages: {
                                            selectingMode: true,
                                            selecting: new Set([message.id]),
                                        },
                                    });
                                    hide?.();
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/select.svg"
                                />
                                <span>Select</span>
                            </Button>
                        </li>
                    </>
                )}

                {(isOurs ||
                    message.type === "system" ||
                    conversation?.membership.is_admin ||
                    conversation?.membership.is_founder ||
                    conversation?.membership.can_delete_messages) && (
                    <li>
                        <Button onClick={deleteBox.show}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                            <span>
                                <u>Delete</u>
                            </span>
                        </Button>
                    </li>
                )}
            </ul>
        </>
    );
};
