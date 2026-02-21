import { CreateType } from "@/features/messages/components/conversations/create/CreateType";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useCallback } from "react";

export const CreateConversation = () => {
    const { data: status } = useQuery({ key: ["status"] });

    const create = useCallback(
        (
            options:
                | { type: "dm" | "channel" | "group"; ids: string[] }
                | { type: "notes" },
        ) => {
            if (!status) {
                return;
            }

            switch (options.type) {
                case "notes": {
                    wrapPromise("createConversation", async () => {
                        return upsertConversation({
                            type: "create",
                            conversation_type: "notes",
                            user: status,
                            member_ids: [],
                        });
                    });
                    break;
                }
                default: {
                    if (
                        !options.ids.length ||
                        options.ids.some((id) => id === status.id)
                    ) {
                        return;
                    }

                    wrapPromise("createConversation", async () => {
                        return upsertConversation({
                            type: "create",
                            conversation_type: "group",
                            user: status,
                            member_ids: options.ids,
                        });
                    });
                    break;
                }
            }
        },
        [status],
    );

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
            </li>

            <li className="w-full">
                <Modal
                    direction="right"
                    className="w-full"
                >
                    <Button onClick={() => create({ type: "notes" })}>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/save.svg"
                        />
                        <span>Notes</span>
                    </Button>
                </Modal>
            </li>

            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => (
                        <CreateType
                            type="both"
                            onSelect={(ids) => create({ type: "dm", ids })}
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/account.svg"
                        />
                        <span>DM</span>
                    </Button>
                </Modal>
            </li>

            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => (
                        <CreateType
                            type="friends"
                            onSelect={(ids) => create({ type: "group", ids })}
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/friends.svg"
                        />
                        <span>Group</span>
                    </Button>
                </Modal>
            </li>

            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => (
                        <CreateType
                            type="friends"
                            onSelect={(ids) => create({ type: "channel", ids })}
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/book.svg"
                        />
                        <span>Channel</span>
                    </Button>
                </Modal>
            </li>
        </ul>
    );
};
