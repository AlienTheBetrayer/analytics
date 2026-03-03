import { YouAreAdmin } from "@/features/messages/components/errors/YouAreAdmin";
import { YouAreFounder } from "@/features/messages/components/errors/YouAreFounder";
import { MemberSettingsProps } from "@/features/messages/components/message/topline/parts/members/settings/MemberSettings";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

export const Permissions = ({
    data,
    conversationData,
}: MemberSettingsProps) => {
    const { data: status } = useQuery({ key: ["status"] });

    // react states
    const [canRead, setCanRead] = useState<boolean>(data.can_read ?? true);
    const [canKick, setCanKick] = useState<boolean>(data.can_kick ?? false);
    const [canInvite, setCanInvite] = useState<boolean>(
        data.can_invite ?? false,
    );
    const [canDelete, setCanDelete] = useState<boolean>(
        data.can_delete_messages ?? false,
    );

    if (
        !conversationData.membership.is_founder &&
        !conversationData.membership.is_admin
    ) {
        return null;
    }

    if (data.is_founder && conversationData.membership.is_founder) {
        return (
            <div className="flex items-center justify-center grow p-4! loading">
                <YouAreFounder />
            </div>
        );
    }

    if (data.is_admin && conversationData.membership.is_admin) {
        return (
            <div className="flex items-center justify-center grow p-4! loading">
                <YouAreAdmin />
            </div>
        );
    }

    return (
        <>
            <hr />

            <form
                className="w-full"
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
                                src="/settings.svg"
                            />
                            Apply
                        </Button>
                    </li>
                </ul>
            </form>
        </>
    );
};
