/** @format */

import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { useAppStore } from "@/zustand/store";
import { WrongURL } from "@/features/messages/components/errors/WrongURL";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { MessageViewList } from "@/features/messages/components/message/MessageViewList";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { NoPermissions } from "@/features/messages/components/errors/NoPermissions";
import { CantRead } from "@/features/messages/components/errors/CantRead";
import { Muted } from "@/features/messages/components/errors/Muted";
import { useMessageView } from "@/features/messages/components/message/useMessageView";
import { useMutedStopwatch } from "@/features/messages/hooks/useMutedStopwatch";

export const MessageView = () => {
    // zustand
    const conversation = useAppStore((state) => state.conversation);

    // muted state
    const { isMuted, relativeTime } = useMutedStopwatch(conversation?.membership.muted_until);

    // fetching + syncing + fallback's code
    const { isLoading, fallbackCode } = useMessageView();

    // fallback
    if (fallbackCode || isLoading || isMuted) {
        return (
            <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                <MessagesTopline />

                <div className="flex items-center justify-center loading grow">
                    {(() => {
                        switch (fallbackCode) {
                            case "wrong-url": {
                                return <WrongURL />;
                            }
                            case "not-selected": {
                                return <NotSelected />;
                            }
                            case "cant-read": {
                                return <CantRead />;
                            }
                            case "muted": {
                                if (!conversation?.membership.muted_until) {
                                    return null;
                                }

                                return <Muted mutedString={relativeTime} />;
                            }
                            case "not-allowed": {
                                return <NoPermissions />;
                            }
                            default: {
                                if (isMuted) {
                                    return <Muted mutedString={relativeTime} />;
                                }
                                return <Spinner />;
                            }
                        }
                    })()}
                </div>
            </article>
        );
    }

    // jsx
    return <MessageViewList />;
};
