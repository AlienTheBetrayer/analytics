import { MemberSettingsProps } from "@/features/messages/components/message/topline/parts/members/settings/MemberSettings";
import { Muting } from "@/features/messages/components/message/topline/parts/members/settings/Muting";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { useQuery } from "@/query/core";
import Image from "next/image";

export const Controls = ({ data, conversationData }: MemberSettingsProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const kickBox = useMessageBox();
    const adminBox = useMessageBox();
    const unmuteBox = useMessageBox();

    if (conversationData.membership.is_founder && data.is_founder) {
        return null;
    }

    if (
        !conversationData.membership.is_admin &&
        !conversationData.membership.is_founder
    ) {
        return null;
    }

    const isOurs = data.user.id === status?.id;

    return (
        <>
            {unmuteBox.render({
                children: "This user will be able to talk again!",
                onSelect: (res) => {
                    if (!status) {
                        return;
                    }

                    if (res === "yes") {
                        updateConversationMembers({
                            type: "unmute",
                            conversation_id: data.conversation_id,
                            user: status,
                            user_ids: [data.user.id],
                        });
                    }
                },
            })}

            {kickBox.render({
                children: isOurs
                    ? "You will leave from this group!"
                    : "This user will be kicked from the group!",
                onSelect: (res) => {
                    if (!status) {
                        return;
                    }

                    if (res === "yes") {
                        updateConversationMembers({
                            type: "kick",
                            conversation_id: data.conversation_id,
                            user: status,
                            user_ids: [data.user.id],
                        });
                    }
                },
            })}

            {adminBox.render({
                children: data.is_admin
                    ? "You will revoke all of their permissions and they'll be a regular user again"
                    : "You are about to make this user administrator with almost all permissions!",
                onSelect: (res) => {
                    if (res === "yes") {
                        if (!status) {
                            return;
                        }

                        wrapPromise("changePermissions", () => {
                            return updateConversationMembers({
                                type: "permissions",
                                user: status,
                                user_ids: [data.user_id],
                                conversation_id: data.conversation_id,
                                is_admin: !data.is_admin,
                            });
                        });
                    }
                },
            })}

            <hr />

            <ul className="flex flex-col gap-2 items-center *:w-full">
                {!data.is_founder &&
                    !(
                        conversationData.membership.is_admin && data.is_admin
                    ) && (
                        <>
                            <li>
                                <Button
                                    className="w-full"
                                    onClick={kickBox.show}
                                >
                                    <div className="w-1 h-1 rounded-full bg-red-1" />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/delete.svg"
                                    />
                                    Kick
                                </Button>
                            </li>

                            <li>
                                <Modal
                                    className="w-full"
                                    direction="screen-middle"
                                    tooltipClassName="w-screen max-w-64"
                                    isActive={!data.muted_until}
                                    element={() => (
                                        <Muting
                                            data={data}
                                            conversationData={conversationData}
                                        />
                                    )}
                                >
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            if (!data.muted_until) {
                                                return;
                                            }

                                            unmuteBox.show();
                                        }}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/auth.svg"
                                        />
                                        {data.muted_until ? "Unmute" : "Mute"}
                                    </Button>
                                </Modal>
                            </li>
                        </>
                    )}

                {conversationData.membership.is_founder && (
                    <li>
                        <Button
                            className="w-full"
                            onClick={adminBox.show}
                        >
                            {data.is_admin && (
                                <div className="w-1 h-1 rounded-full bg-red-1" />
                            )}
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cube.svg"
                            />
                            {data.is_admin
                                ? "Revoke administration"
                                : "Grant administration"}
                        </Button>
                    </li>
                )}
            </ul>
        </>
    );
};
