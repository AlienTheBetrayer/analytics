import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const MemberSettings = ({ data }: Props) => {
    const kickBox = useMessageBox();
    const { data: status } = useQuery({ key: ["status"] });
    const isOurs = data.user.id === status?.id;

    // react states
    const [canRead, setCanRead] = useState<boolean>(data.can_read ?? true);
    const [canKick, setCanKick] = useState<boolean>(data.can_kick ?? false);
    const [canInvite, setCanInvite] = useState<boolean>(
        data.can_invite ?? false,
    );
    const [canDelete, setCanDelete] = useState<boolean>(
        data.can_delete_messages ?? false,
    );

    return (
        <ul className="box p-4! gap-4! items-center acrylic">
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

            <li>
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/settings.svg"
                    />
                    Member settings
                </span>
            </li>

            <li className="w-full">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!status) {
                            return;
                        }

                        wrapPromise("changePermissions", () => {
                            return updateConversationMembers({
                                type: "permissions",
                                user: status,
                                user_ids: [data.user_id],
                                conversation_id: data.conversation_id,
                                can_read: canRead,
                                can_invite: canInvite,
                                can_delete_messages: canDelete,
                                can_kick: canKick,
                            });
                        });
                    }}
                >
                    <ul className="flex flex-col gap-2 w-full">
                        <li>
                            <Checkbox
                                value={canRead}
                                onToggle={(flag) => setCanRead(flag)}
                            >
                                Read messages
                            </Checkbox>
                        </li>

                        <li>
                            <Checkbox
                                value={canKick}
                                onToggle={(flag) => setCanKick(flag)}
                            >
                                Kick others
                            </Checkbox>
                        </li>

                        <li>
                            <Checkbox
                                value={canDelete}
                                onToggle={(flag) => setCanDelete(flag)}
                            >
                                Delete other messages
                            </Checkbox>
                        </li>

                        <li>
                            <Checkbox
                                value={canInvite}
                                onToggle={(flag) => setCanInvite(flag)}
                            >
                                Create invites
                            </Checkbox>
                        </li>

                        <li>
                            <Button
                                className="w-full"
                                type="submit"
                            >
                                <PromiseState state="changePermissions" />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/send.svg"
                                />
                                Apply
                            </Button>
                        </li>
                    </ul>
                </form>
            </li>

            <li className="w-full">
                <Button
                    className="w-full"
                    onClick={kickBox.show}
                >
                    <div className="w-1 h-1 rounded-full bg-red-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/auth.svg"
                    />
                    {isOurs ? "Leave" : "Kick"}
                </Button>
            </li>
        </ul>
    );
};
