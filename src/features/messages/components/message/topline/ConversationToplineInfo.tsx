import { MiniProfile } from "@/features/messages/components/message/topline/miniprofile/MiniProfile";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useParams } from "next/navigation";

type Props = {
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const ConversationToplineInfo = ({
    conversationData,
    retrieved,
}: Props) => {
    // fetching
    const { tab } = useParams<{ tab?: string }>();

    switch (tab) {
        case "notes": {
            // notes / board
            return (
                <MiniProfile
                    type="notes"
                    data={conversationData}
                />
            );
        }
        case "u": {
            if (conversationData) {
                // already have an ongoing conversation
                return (
                    <MiniProfile
                        type="conversation"
                        data={conversationData}
                    />
                );
            } else {
                if (retrieved) {
                    // no conversation but user exists
                    return (
                        <MiniProfile
                            type="retrieved"
                            data={retrieved}
                        />
                    );
                } else {
                    // no conversation and user is absent
                    return <MiniProfile type="unknown" />;
                }
            }
        }
        case "c": {
            if (!conversationData?.type) {
                // conversation is invalid
                return <MiniProfile type="unknown" />;
            }

            // already an ongoing conversation
            switch (conversationData?.type) {
                case "notes": {
                    return (
                        <MiniProfile
                            type="notes"
                            data={conversationData}
                        />
                    );
                }
                default: {
                    return (
                        <MiniProfile
                            type="conversation"
                            data={conversationData}
                        />
                    );
                }
            }
        }
        default: {
            return <MiniProfile type="unknown" />;
        }
    }
};
