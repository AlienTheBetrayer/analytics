/** @format */

import { Avatar } from "@/features/messages/components/conversations/display/parts/Avatar";
import { BottomButtons } from "@/features/messages/components/conversations/display/parts/BottomButtons";
import { LastMessage } from "@/features/messages/components/conversations/display/parts/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/parts/LastMessageDate";
import { MutedStatus } from "@/features/messages/components/conversations/display/parts/Muted";
import { Name } from "@/features/messages/components/conversations/display/parts/Name";
import { PermissionStatus } from "@/features/messages/components/conversations/display/parts/PermissionStatus";
import { useMutedStopwatch } from "@/features/messages/hooks/useMutedStopwatch";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { ExpandedConversation } from "@/query-api/protocol/messages";
import { useAppStore } from "@/zustand/store";

type Props = {
    conversationId: string;
};

export const ConversationDisplay = ({ conversationId }: Props) => {
    // zustand
    const conversation = useAppStore((state) => state.conversations?.conversations.get(conversationId));

    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return <ConversationDisplayView conversation={conversation} />;
};

type ViewProps = {
    conversation: ExpandedConversation;
};

const ConversationDisplayView = ({ conversation }: ViewProps) => {
    // zustand
    const selectedConversation = useAppStore((state) => state.retrieved?.conversation_id);

    // ui states
    const isSelected = selectedConversation === conversation.id;
    const stopwatch = useMutedStopwatch(conversation?.membership.muted_until);

    // jsx
    return (
        <div className="relative">
            <MutedStatus stopwatch={stopwatch} />
            <LinkButton
                className={`box p-4! flex-row! h-20! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={isSelected ? "/messages/" : `/messages/c/${conversation.id}`}
                isEnabled={!stopwatch.isMuted}
            >
                <PermissionStatus conversation={conversation} />
                <Avatar conversation={conversation} />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="flex items-center">
                        <Name conversation={conversation} />
                        <LastMessageDate conversation={conversation} />
                    </div>

                    <LastMessage conversation={conversation} />
                </div>
            </LinkButton>

            <BottomButtons
                type="regular"
                conversation={conversation}
            />
        </div>
    );
};
