import { MiniProfile } from "@/features/messages/components/message/topline/MiniProfile";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const ConversationToplineInfo = ({
    data,
    conversationData,
    retrieved,
}: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { tab, id } = useParams<{ tab?: string; id?: string }>();

    if (tab === "notes" || conversationData?.type === "notes") {
        return (
            <ul className="flex items-center gap-1">
                <li className="flex items-center gap-1">
                    <Tooltip
                        direction="top"
                        text="Note messages"
                    >
                        <LinkButton href="/messages/notes">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/save.svg"
                            />
                            <TabSelection condition={id !== "board"} />
                        </LinkButton>
                    </Tooltip>
                </li>

                <li className="flex items-center gap-1">
                    <Tooltip
                        direction="top"
                        text="Noteboard"
                    >
                        <LinkButton href="/messages/notes/board">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/dashboard.svg"
                            />
                            <TabSelection condition={id === "board"} />
                        </LinkButton>
                    </Tooltip>
                </li>
            </ul>
        );
    }

    if (!data) {
        if (retrieved?.user) {
            return (
                <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <MiniProfile data={retrieved.user} />
                </div>
            );
        }

        return null;
    }

    // jsx selector if data exists
    return (
        <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-1" />

            {(() => {
                switch (conversationData?.type) {
                    case "dm": {
                        const user =
                            conversationData?.conversation_members.find(
                                (m) => m.user_id !== status?.id,
                            )?.user;

                        if (!user) {
                            return null;
                        }

                        return <MiniProfile data={user} />;
                    }
                    case "group": {
                        return (
                            <span className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                                {conversationData.title ?? "Group"}
                            </span>
                        );
                    }
                    default: {
                        return null;
                    }
                }
            })()}
        </div>
    );
};
