import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import React, { useMemo } from "react";

type Props = {
    className?: string;
    data: CacheAPIProtocol["user"]["data"];
};

export const Role = ({ className, data }: Props) => {
    const roleStyle = useMemo((): {
        element: React.ReactNode;
        tooltip: string;
    } => {
        switch (data.role) {
            case "user": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! outline-1 outline-[#8a8b91] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/account.svg"
                                />
                                <span>User</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} is a regular user.`,
                };
            }
            case "admin": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! outline-1 outline-[#97a2da] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/security.svg"
                                />
                                <span>Admin</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} is an admin.`,
                };
            }
            case "op": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! outline-1 outline-[#cd5151] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/settings.svg"
                                />
                                <span>OP</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} is the founder.`,
                };
            }
        }
    }, [data, className]);

    return (
        <Tooltip
            direction="bottom"
            text={roleStyle.tooltip}
            className="w-full"
        >
            {roleStyle.element}
        </Tooltip>
    );
};
