/** @format */

import "../../message/ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { deleteConversation, upsertConversation } from "@/query-api/calls/conversation";
import { ExpandedConversation } from "@/query-api/protocol/messages";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";

type Props = {
    conversation: ExpandedConversation | null;
};

export const RegularContextMenu = ({ conversation }: Props) => {
    // url
    const { id } = useParams<{ id?: string }>();

    // message boxes
    const deleteBox = useMessageBox();
    const leaveBox = useMessageBox();
    const clearBox = useMessageBox();

    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return (
        <>
            {deleteBox.render({
                children: "Conversation will be deleted along with all its messages!",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("deleteConversation", () => {
                            return deleteConversation({
                                conversation_id: conversation.id,
                                type: "delete-all",
                            });
                        });

                        if (id === conversation.id) {
                            redirect("/messages/");
                        }
                    }
                },
            })}

            {leaveBox.render({
                children: "You won't be able to view / message here until you get re-invited!",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("leaveConversation", () => {
                            return deleteConversation({
                                conversation_id: conversation.id,
                                type: "leave",
                            });
                        });

                        if (id === conversation.id) {
                            redirect("/messages/");
                        }
                    }
                },
            })}

            {clearBox.render({
                children: "Every message in this conversation will be cleared, but the conversation will stay!",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("clearConversation", () => {
                            return deleteConversation({
                                conversation_id: conversation.id,
                                type: "clear-history",
                            });
                        });
                    }
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

                {conversation.type === "notes" && (
                    <li>
                        <LinkButton href="/messages/notes/board">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/dashboard.svg"
                            />
                            Board
                        </LinkButton>
                    </li>
                )}

                {conversation.type === "dm" && (
                    <li>
                        <LinkButton href={`/profile/${conversation.peer?.username}`}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/account.svg"
                            />
                            <span>Profile</span>
                        </LinkButton>
                    </li>
                )}

                {conversation.type !== "notes" && (
                    <>
                        <li>
                            <Button
                                onClick={() => {
                                    wrapPromise("archive", () => {
                                        return upsertConversation({
                                            type: "edit",
                                            conversation_id: conversation.id,
                                            archived: !conversation.conversation_meta?.archived,
                                        });
                                    });
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/archive.svg"
                                />
                                <span className="flex items-center gap-1">
                                    <PromiseState state="archive" />
                                    <span>{conversation.conversation_meta?.archived ? "Unarchive" : "Archive"}</span>
                                </span>
                            </Button>
                        </li>

                        <li>
                            <Button
                                onClick={() => {
                                    wrapPromise("pin", () => {
                                        return upsertConversation({
                                            type: "edit",
                                            conversation_id: conversation.id,
                                            pinned: !conversation.conversation_meta?.pinned,
                                        });
                                    });
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pin.svg"
                                />

                                <span className="flex items-center gap-1">
                                    <PromiseState state="pin" />
                                    <span>{conversation.conversation_meta?.pinned ? "Unpin" : "Pin"}</span>
                                </span>
                            </Button>
                        </li>

                        <li>
                            <Button onClick={leaveBox.show}>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/auth.svg"
                                />
                                <span className="flex items-center">
                                    <PromiseState state="leaveConversation" />
                                    <span>Leave</span>
                                </span>
                            </Button>
                        </li>
                    </>
                )}

                {(conversation.type !== "group" ||
                    (conversation.type === "group" && conversation.membership.is_founder)) && (
                    <li>
                        <Button onClick={clearBox.show}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/book.svg"
                            />
                            <span className="flex items-center gap-1">
                                <PromiseState state="clearConversation" />
                                <span>Clear history</span>
                            </span>
                        </Button>
                    </li>
                )}

                {conversation.type !== "notes" && (
                    <li>
                        <Button onClick={deleteBox.show}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                            <span className="flex items-center gap-1">
                                <PromiseState state="deleteConversation" />
                                <span>
                                    Delete for <u>everyone</u>
                                </span>
                            </span>
                        </Button>
                    </li>
                )}
            </ul>
        </>
    );
};
