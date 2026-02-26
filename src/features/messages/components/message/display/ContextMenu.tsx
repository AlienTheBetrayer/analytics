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

type Props = {
    hide?: () => void;
    onAction?: MessageDisplayProps["onAction"];
    data: CacheAPIProtocol["messages"]["data"][number];
};

export const ContextMenu = ({ data, hide, onAction }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    const isOurs = data.user_id === status?.id;
    const deleteBox = useMessageBox();

    return (
        <>
            {deleteBox.render({
                children: "This message will be deleted!",
                onSelect(response) {
                    if (!status) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({ message: [data], user: status });
                    }
                    hide?.();
                },
            })}

            <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
                <li className="flex items-center gap-1 mb-6! self-center">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/settings.svg"
                    />
                </li>

                {data.type !== "system" && (
                    <>
                        <li>
                            <Button
                                onClick={() => {
                                    onAction?.("reply");
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
                                    onClick={() => {
                                        onAction?.("edit");
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

                        <li>
                            <Button>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pin.svg"
                                />
                                <span>Pin</span>
                            </Button>
                        </li>
                    </>
                )}

                <li>
                    <Button
                        onClick={() => {
                            wrapPromise("saveClipboard", () => {
                                return navigator.clipboard.writeText(
                                    data.message,
                                );
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

                {data.type !== "system" && (
                    <>
                        <li>
                            <Modal
                                blur
                                direction="screen-middle"
                                className="w-full"
                                element={(hide2) => (
                                    <Forwarding
                                        onAction={(conversation) => {
                                            onAction?.("forward", {
                                                conversation,
                                            });
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
                                            selecting: new Map([
                                                [data.id, data],
                                            ]),
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

                {isOurs && (
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
