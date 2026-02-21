import { ConversationToplineInfo } from "@/features/messages/components/message/topline/ConversationToplineInfo";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import { useAppStore } from "@/zustand/store";
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
    const display = useAppStore((state) => state.display.messages);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    return (
        <div className="flex flex-col gap-2">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="flex items-center gap-1 ml-4! self-stretch">
                    <Tooltip
                        direction="top"
                        text="Back to chats"
                        className="self-stretch h-full flex lg:hidden -ml-4 mr-2"
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
                                                    key: [
                                                        "noteboards",
                                                        status.id,
                                                    ],
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

            {id !== "board" && (
                <ul
                    className={`box min-h-10! h-10! gap-1! p-0! items-center! flex-row!
                    ${!data?.messages.length ? "opacity-30" : ""}`}
                    inert={!!!data?.messages.length}
                >
                    {!data?.messages.length && (
                        <li className="absolute left-1/2 top-1/2 -translate-1/2">
                            <span className="flex items-center gap-1">
                                <div className="bg-blue-1 rounded-full w-1 h-1" />
                                <span>
                                    Send a <mark>message</mark> to access
                                </span>
                            </span>
                        </li>
                    )}

                    <li>
                        <Tooltip
                            direction="bottom"
                            text="Sorting direction"
                        >
                            <Button
                                onClick={() =>
                                    updateDisplay({
                                        messages: {
                                            reversed: !display.reversed,
                                        },
                                    })
                                }
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/sort.svg"
                                    className={`${display.reversed ? "rotate-180" : ""} duration-500!`}
                                />
                                <TabSelection
                                    condition={true}
                                    color={
                                        display.reversed
                                            ? "var(--orange-1)"
                                            : "var(--blue-1)"
                                    }
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Filter by title">
                            <Input
                                placeholder="Filter..."
                                value={display.filter}
                                onChange={(value) =>
                                    updateDisplay({
                                        messages: { filter: value },
                                    })
                                }
                            />
                        </Tooltip>
                    </li>
                </ul>
            )}
        </div>
    );
};
