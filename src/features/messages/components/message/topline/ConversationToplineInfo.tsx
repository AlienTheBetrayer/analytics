/** @format */

import { MiniProfile } from "@/features/messages/components/message/topline/miniprofile/MiniProfile";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";

export const ConversationToplineInfo = () => {
    // url
    const { tab } = useParams<{ tab?: string }>();

    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const retrieved = useAppStore((state) => state.retrieved);

    // jsx fallbacks
    switch (tab) {
        case "notes": {
            // notes / board
            return (
                <MiniProfile
                    type="notes"
                    data={conversation}
                />
            );
        }
        case "u": {
            if (conversation) {
                // already have an ongoing conversation
                return (
                    <MiniProfile
                        type="conversation"
                        data={conversation}
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
            if (!conversation?.type) {
                // conversation is invalid
                return <MiniProfile type="unknown" />;
            }

            // already an ongoing conversation
            switch (conversation?.type) {
                case "notes": {
                    return (
                        <MiniProfile
                            type="notes"
                            data={conversation}
                        />
                    );
                }
                default: {
                    return (
                        <MiniProfile
                            type="conversation"
                            data={conversation}
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
