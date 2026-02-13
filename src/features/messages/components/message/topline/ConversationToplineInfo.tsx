import { MiniProfile } from "@/features/messages/components/message/topline/MiniProfile";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const ConversationToplineInfo = ({ data, retrieved }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    if (!data) {
        if (!retrieved?.user) {
            return null;
        }

        return (
            <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-orange-1" />
                <MiniProfile data={retrieved.user} />
            </div>
        );
    }

    // jsx selector
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
                    default: {
                        return null;
                    }
                }
            })()}
        </div>
    );
};
