import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const PermissionBadges = ({ data }: Props) => {
    if (data.is_founder) {
        return (
            <ul className="flex gap-1 items-center">
                <PermissionBadge
                    text="Group's founder"
                    src="/cube.svg"
                >
                    <span className="flex items-center gap-1 mx-2">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        Founder
                    </span>
                </PermissionBadge>
            </ul>
        );
    }

    return (
        <ul className="flex gap-1 items-center">
            {data.can_read && (
                <PermissionBadge
                    text="Message reading allowed"
                    src="/eye.svg"
                />
            )}

            {data.can_kick && (
                <PermissionBadge
                    text="Can kick other users"
                    src="/auth.svg"
                />
            )}

            {data.can_delete_messages && (
                <PermissionBadge
                    text="Can delete other messages"
                    src="/delete.svg"
                />
            )}

            {data.can_invite && (
                <PermissionBadge
                    text="Can create invites"
                    src="/plus.svg"
                />
            )}
        </ul>
    );
};

type BadgeProps = {
    text?: string;
    src?: string;
    children?: React.ReactNode;
};

const PermissionBadge = ({ text, src, children }: BadgeProps) => {
    return (
        <li>
            <Tooltip
                text={text}
                direction="top"
            >
                <div className="box flex-row! items-center gap-1! p-0.75! rounded-lg! bg-bg-2!">
                    {!!children && children}
                    {!!src && (
                        <small>
                            <Image
                                alt=""
                                width={13}
                                height={13}
                                src={src}
                            />
                        </small>
                    )}
                </div>
            </Tooltip>
        </li>
    );
};
