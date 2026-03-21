/** @format */

import { EditingMenu } from "@/features/messages/components/message/editing/EditingMenu";
import { ConversationToplineInfo } from "@/features/messages/components/message/topline/ConversationToplineInfo";
import { CreateInvites } from "@/features/messages/components/message/topline/parts/invites/CreateInvites";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Members } from "@/features/messages/components/message/topline/parts/members/Members";
import { useAppStore } from "@/zustand/store";

export const Main = () => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // url
    const { id, tab } = useParams<{
        id?: string;
        tab?: string;
    }>();

    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const messages = useAppStore((state) => state.messages);
    const retrieved = useAppStore((state) => state.retrieved);

    // jsx
    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            <li className="flex items-center gap-1">
                {tab && (
                    <Tooltip
                        direction="top"
                        text="Back to chats"
                        className="flex"
                    >
                        <LinkButton
                            className="aspect-square!"
                            href="/messages/"
                        >
                            <div className="w-1 h-1 rounded-full bg-orange-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                )}

                <ConversationToplineInfo />
            </li>

            <li className="ml-auto!">
                <ul className="flex items-center gap-1">
                    {id !== "board" && messages && conversation && (
                        <>
                            {conversation.type === "group" && (
                                <>
                                    <li>
                                        <Modal
                                            tooltipClassName="w-screen max-w-lg"
                                            direction="screen-middle"
                                            element={() => <Members />}
                                        >
                                            <Tooltip
                                                direction="top"
                                                text="Members"
                                            >
                                                <Button>
                                                    <Image
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        src="/friends.svg"
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </Modal>
                                    </li>

                                    {(conversation.membership.can_invite === true ||
                                        conversation.membership.is_admin ||
                                        conversation.membership.is_founder) && (
                                        <li>
                                            <Modal
                                                tooltipClassName="w-screen max-w-lg"
                                                direction="screen-middle"
                                                element={() => <CreateInvites />}
                                            >
                                                <Tooltip
                                                    direction="top"
                                                    text="Create an invitation"
                                                >
                                                    <Button>
                                                        <Image
                                                            alt=""
                                                            width={16}
                                                            height={16}
                                                            src="/link.svg"
                                                        />
                                                    </Button>
                                                </Tooltip>
                                            </Modal>
                                        </li>
                                    )}
                                </>
                            )}

                            <li>
                                <Modal
                                    direction="screen-middle"
                                    tooltipClassName="w-screen max-w-2xl"
                                    element={(hide) => <EditingMenu hide={hide} />}
                                >
                                    <Tooltip
                                        direction="top"
                                        text="Edit conversation"
                                    >
                                        <Button>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/pencil.svg"
                                            />
                                        </Button>
                                    </Tooltip>
                                </Modal>
                            </li>
                        </>
                    )}

                    <li>
                        <Tooltip
                            direction="top"
                            text={`Re-fetch ${id === "board" ? "noteboards" : "messages"}`}
                        >
                            <Button
                                onClick={() => {
                                    if (!status) {
                                        return;
                                    }

                                    if (id === "board") {
                                        wrapPromise("reload", async () => {
                                            return queryInvalidate({
                                                key: ["noteboards", status.id],
                                                silent: false,
                                            });
                                        });
                                    } else {
                                        if (!retrieved?.conversation_id) {
                                            return;
                                        }

                                        wrapPromise("reload", async () => {
                                            queryInvalidate({
                                                key: ["messages", retrieved.conversation_id],
                                                silent: false,
                                            });
                                            return queryInvalidate({
                                                key: ["conversations", status.id],
                                            });
                                        });
                                    }
                                }}
                            >
                                <PromiseState state="reload" />
                                <Image
                                    alt=""
                                    width={14}
                                    height={14}
                                    src="/reload.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
