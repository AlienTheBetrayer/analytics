import { EditingMenu } from "@/features/messages/components/message/editing/EditingMenu";
import { ConversationToplineInfo } from "@/features/messages/components/message/topline/ConversationToplineInfo";
import { AddFriends } from "@/features/messages/components/message/topline/parts/addfriends/AddFriends";
import { CreateInvites } from "@/features/messages/components/message/topline/parts/invites/CreateInvites";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const Main = ({ data, conversationData, retrieved }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { id } = useParams<{
        id?: string;
    }>();

    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            <li className="flex items-center gap-1 self-stretch">
                <Tooltip
                    direction="top"
                    text="Back to chats"
                    className="self-stretch h-full flex lg:hidden "
                >
                    <LinkButton
                        className="h-full aspect-square!"
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

                <ConversationToplineInfo
                    conversationData={conversationData}
                    retrieved={retrieved}
                />
            </li>

            <li className="ml-auto!">
                <ul className="flex items-center gap-1">
                    {id !== "board" && data && conversationData && (
                        <>
                            {conversationData.type === "group" && (
                                <>
                                    <li>
                                        <Modal
                                            direction="screen-middle"
                                            blur
                                            element={() => (
                                                <CreateInvites
                                                    conversationData={
                                                        conversationData
                                                    }
                                                />
                                            )}
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
                                    <li>
                                        <Modal
                                            direction="screen-middle"
                                            blur
                                            element={() => (
                                                <AddFriends
                                                    conversationData={
                                                        conversationData
                                                    }
                                                />
                                            )}
                                        >
                                            <Tooltip
                                                direction="top"
                                                text="Add friends"
                                            >
                                                <Button>
                                                    <Image
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        src="/cubeadd.svg"
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </Modal>
                                    </li>
                                </>
                            )}

                            <li>
                                <Modal
                                    direction="screen-middle"
                                    blur
                                    element={(hide) => (
                                        <EditingMenu
                                            hide={hide}
                                            data={data}
                                            conversationData={conversationData}
                                        />
                                    )}
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
                                            return queryInvalidate({
                                                key: [
                                                    "messages",
                                                    retrieved.conversation_id,
                                                ],
                                                silent: false,
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
