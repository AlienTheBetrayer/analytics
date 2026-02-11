import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";

type Props = {
    conversation_id: string;
};

export const ConversationToplineInfo = ({ conversation_id }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations } = useQuery({
        key: ["conversations", status?.id],
    });

    // derived
    const conversation = conversations?.find((c) => c.id === conversation_id);

    // fallbacks
    if (!conversation) {
        return null;
    }

    // jsx selector
    return (
        <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-1" />

            {(() => {
                switch (conversation.type) {
                    case "dm": {
                        const user = conversation.conversation_members.find(
                            (m) => m.user_id !== status?.id,
                        )?.user;

                        return (
                            <Tooltip
                                direction="top"
                                text="Go to profile"
                            >
                                <LinkButton
                                    href={`/profile/${user?.username}`}
                                    className="gap-1!"
                                >
                                    <ProfileImage
                                        profile={user?.profile}
                                        width={256}
                                        height={256}
                                        className="w-5! h-5!"
                                    />
                                    <span>{user?.username}</span>
                                </LinkButton>
                            </Tooltip>
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
