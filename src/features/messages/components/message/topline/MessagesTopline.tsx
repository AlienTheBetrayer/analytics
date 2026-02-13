import { ConversationToplineInfo } from "@/features/messages/components/message/topline/ConversationToplineInfo";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const MessagesTopline = ({ data, retrieved }: Props) => {
    return (
        <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
            <li className="ml-4!">
                <ConversationToplineInfo
                    data={data}
                    retrieved={retrieved}
                />
            </li>

            <li className="ml-auto!">
                <Tooltip
                    direction="top"
                    text="Re-fetch messages"
                >
                    <Button
                        onClick={() => {
                            if (!retrieved?.conversation_id) {
                                return;
                            }

                            wrapPromise("reloadMessages", async () => {
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
                        <PromiseState state="reloadMessages" />
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
    );
};
