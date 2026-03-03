import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const PermissionBadges = ({ data }: Props) => {
    if (data.is_founder) {
        return (
            <ul className="flex gap-1 items-center">
                <PermissionBadge>
                    <span className="flex items-center gap-1 mx-2">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <span>Founder</span>
                        <small className="ml-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cube.svg"
                            />
                        </small>
                    </span>
                </PermissionBadge>
            </ul>
        );
    }

    return (
        <ul className="flex gap-1 items-center">
            {data.can_kick && <PermissionBadge src="/auth.svg" />}
            {data.can_delete_messages && <PermissionBadge src="/delete.svg" />}
            {data.can_invite && <PermissionBadge src="/plus.svg" />}
        </ul>
    );
};

type BadgeProps = {
    src?: string;
    children?: React.ReactNode;
};

const PermissionBadge = ({ src, children }: BadgeProps) => {
    return (
        <li>
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
        </li>
    );
};
