/** @format */

import { ExpandedConversation } from "@/query-api/protocol/messages";

type Props = {
    conversation: ExpandedConversation;
};

export const PermissionStatus = ({ conversation }: Props) => {
    return (
        <div className="flex items-center gap-1 absolute left-3 top-3">
            {conversation.membership.is_founder && (
                <PermissionStatusBadge
                    src="/cube.svg"
                    color="var(--blue-1)"
                />
            )}

            {conversation.membership.is_admin && (
                <PermissionStatusBadge
                    src="/server.svg"
                    color="var(--red-1)"
                />
            )}
        </div>
    );
};

type BadgeProps = {
    src: string;
    color: string;
};
const PermissionStatusBadge = ({ color }: BadgeProps) => {
    return (
        <div className="box p-1! flex-row! items-center gap-0! rounded-lg">
            <div
                className="w-1 h-1 rounded-full"
                style={{ background: color }}
            />
        </div>
    );
};
