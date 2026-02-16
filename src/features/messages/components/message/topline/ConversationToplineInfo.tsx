import { MiniProfile } from "@/features/messages/components/message/topline/MiniProfile";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const ConversationToplineInfo = ({ data, retrieved }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { tab, id } = useParams<{ tab?: string; id?: string }>();

    if (!data) {
        if (tab === "notes") {
            return (
                <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <span>Notes</span>
                </div>
            );
        }

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

    // jsx selector if already exists
    return (
        <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-1" />

            {(() => {
                switch (data.type) {
                    case "dm": {
                        const user = data.conversation_members.find(
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
                                {data.title ?? "Group"}
                            </span>
                        );
                    }
                    case "notes": {
                        return (
                            <span className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/save.svg"
                                />
                                {data.title ?? "Notes"}
                            </span>
                        );
                    }
                    default: {
                        // url selector

                        return null;
                    }
                }
            })()}
        </div>
    );
};
