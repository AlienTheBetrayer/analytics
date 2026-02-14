import "../message/ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { deleteConversation } from "@/query-api/calls/conversation";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ContextMenu = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    const deleteBox = useMessageBox();
    const leaveBox = useMessageBox();

    return (
        <>
            {deleteBox.render({
                children:
                    "Conversation will be deleted along with all its messages!",
                onSelect: (res) => {
                    if (res === "yes") {
                        if (!status) {
                            return;
                        }

                        wrapPromise("deleteConversation", () => {
                            return deleteConversation({
                                user_id: status.id,
                                conversation_id: data.id,
                                type: "delete-all",
                            });
                        });
                    }
                },
            })}

            {leaveBox.render({
                children:
                    "You won't be able to view / message here until you get re-invited!",
                onSelect: (res) => {
                    if (res === "yes") {
                        if (!status) {
                            return;
                        }

                        wrapPromise("leaveConversation", () => {
                            return deleteConversation({
                                user_id: status.id,
                                conversation_id: data.id,
                                type: "leave",
                            });
                        });
                    }
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

                {data.type === "dm" && (
                    <li>
                        <LinkButton
                            href={`/profile/${data.conversation_members.find((m) => m.user_id !== status?.id)?.user.username}`}
                        >
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

                <li>
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/archive.svg"
                        />
                        <span>Archive</span>
                    </Button>
                </li>

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

                <li>
                    <Button onClick={deleteBox.show}>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                        <span className="flex items-center">
                            <PromiseState state="deleteConversation" />
                            <span>
                                Delete for <u>everyone</u>
                            </span>
                        </span>
                    </Button>
                </li>
            </ul>
        </>
    );
};
