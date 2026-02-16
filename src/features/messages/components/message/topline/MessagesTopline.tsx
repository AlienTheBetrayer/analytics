import { ConversationToplineInfo } from "@/features/messages/components/message/topline/ConversationToplineInfo";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
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
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const MessagesTopline = ({ data, retrieved }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { tab, id } = useParams<{
        tab?: string;
        id?: string;
    }>();

    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            <li className="ml-4!">
                <ConversationToplineInfo
                    data={data}
                    retrieved={retrieved}
                />
            </li>

            <li className="ml-auto!">
                <ul className="flex items-center gap-1">
                    {tab === "notes" && id !== "board" && (
                        <li>
                            <Tooltip
                                direction="top"
                                text="To noteboard"
                            >
                                <LinkButton href="/messages/notes/board">
                                    <Image
                                        alt="board"
                                        width={16}
                                        height={16}
                                        src="/dashboard.svg"
                                    />
                                </LinkButton>
                            </Tooltip>
                        </li>
                    )}

                    <li>
                        <Tooltip
                            direction="top"
                            text="Re-fetch messages"
                            isEnabled={!!retrieved?.conversation_id}
                        >
                            <Button
                                onClick={() => {
                                    if (!status) {
                                        return;
                                    }

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
