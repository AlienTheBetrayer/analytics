/** @format */

import { MemberSettingsProps } from "@/features/messages/components/message/topline/parts/members/settings/MemberSettings";
import { Muting } from "@/features/messages/components/message/topline/parts/members/settings/Muting";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Controls = ({ data }: MemberSettingsProps) => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // message boxes
    const kickBox = useMessageBox();
    const adminBox = useMessageBox();
    const unmuteBox = useMessageBox();

    // zusatnd
    const conversation = useAppStore((state) => state.conversation);

    // fallbacks
    if (conversation?.membership.is_founder && data.is_founder) {
        return null;
    }
    if (!conversation?.membership.is_admin && !conversation?.membership.is_founder) {
        return null;
    }

    // ui states
    const isOurs = data.user.id === status?.id;
    const isMuted = data.muted_until ? new Date(data.muted_until) > new Date() : false;

    return (
        <>
            {unmuteBox.render({
                children: "This user will be able to talk again!",
                onSelect: (res) => {
                    if (res === "yes") {
                        updateConversationMembers({
                            type: "unmute",
                            conversation_id: data.conversation_id,
                            user_ids: [data.user.id],
                        });
                    }
                },
            })}

            {kickBox.render({
                children: isOurs ? "You will leave from this group!" : "This user will be kicked from the group!",
                onSelect: (res) => {
                    if (res === "yes") {
                        updateConversationMembers({
                            type: "kick",
                            conversation_id: data.conversation_id,
                            user_ids: [data.user.id],
                        });
                    }
                },
            })}

            {adminBox.render({
                children:
                    data.is_admin ?
                        "You will revoke all of their permissions and they'll be a regular user again"
                    :   "You are about to make this user administrator with almost all permissions!",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("changePermissions", () => {
                            return updateConversationMembers({
                                type: "permissions",
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
                {!data.is_founder && !(conversation?.membership.is_admin && data.is_admin) && (
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
                                isActive={!isMuted}
                                element={() => <Muting data={data} />}
                            >
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        if (!isMuted) {
                                            return;
                                        }

                                        unmuteBox.show();
                                    }}
                                >
                                    <div
                                        className="w-1 h-1 rounded-full"
                                        style={{
                                            background: isMuted ? "var(--blue-1)" : "var(--orange-1)",
                                        }}
                                    />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/auth.svg"
                                    />
                                    {isMuted ? "Unmute" : "Mute"}
                                    {isMuted && <small className="truncate">({relativeTime(data.muted_until)})</small>}
                                </Button>
                            </Modal>
                        </li>
                    </>
                )}

                {conversation?.membership.is_founder && (
                    <li>
                        <Button
                            className="w-full"
                            onClick={adminBox.show}
                        >
                            {data.is_admin && <div className="w-1 h-1 rounded-full bg-red-1" />}
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cube.svg"
                            />
                            {data.is_admin ? "Revoke administration" : "Grant administration"}
                        </Button>
                    </li>
                )}
            </ul>
        </>
    );
};
