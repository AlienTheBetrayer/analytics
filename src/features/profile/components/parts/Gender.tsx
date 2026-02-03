import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import React, { useMemo } from "react";

type Props = {
    className?: string;
    data: CacheAPIProtocol["user"]["data"];
};

export const Gender = ({ className, data }: Props) => {
    const genderStyle = useMemo((): {
        element: React.ReactNode;
        tooltip: string;
    } => {
        switch (data.profile.gender) {
            case "female": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! outline-1 outline-[#e0afbb] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/female.svg"
                                />
                                <span>Female</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} is a girl.`,
                };
            }
            case "male": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! outline-1 outline-[#82aece] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/male.svg"
                                />
                                <span>Male</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} is a man.`,
                };
            }
            case "other": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! outline-1 outline-[#9d95c7] ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/cube.svg"
                                />
                                <span>Other</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} has a different gender.`,
                };
            }
            default:
            case "unspecified": {
                return {
                    element: (
                        <div
                            className={`box p-1! px-2! w-max! items-center! ${className ?? ""}`}
                        >
                            <div className="flex gap-1">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/menu.svg"
                                />
                                <span>Unspecified</span>
                            </div>
                        </div>
                    ),
                    tooltip: `${data.username} hasn't specified a gender.`,
                };
            }
        }
    }, [data, className]);

    return (
        <Tooltip
            className="w-full"
            direction="bottom"
            text={genderStyle.tooltip}
        >
            {genderStyle.element}
        </Tooltip>
    );
};
