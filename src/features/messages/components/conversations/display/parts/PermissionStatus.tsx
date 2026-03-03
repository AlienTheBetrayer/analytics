import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const PermissionStatus = ({ data }: Props) => {
    return (
        <div className="flex items-center gap-1 absolute left-1 top-1">
            {data.membership.is_founder && (
                <PermissionStatusBadge
                    src="/cube.svg"
                    color="var(--blue-1)"
                />
            )}

            {data.membership.is_admin && (
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
const PermissionStatusBadge = ({ src, color }: BadgeProps) => {
    return (
        <div className="box p-0.75! flex-row! items-center gap-0! rounded-lg">
            <div
                className="w-1 h-1 rounded-full"
                style={{ background: color }}
            />
            <Image
                alt=""
                width={13}
                height={13}
                src={src}
            />
        </div>
    );
};
