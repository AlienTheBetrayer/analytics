import { ColorSwatches } from "@/features/profile/components/parts/ColorSwatches";
import { Gender } from "@/features/profile/components/parts/Gender";
import { Role } from "@/features/profile/components/parts/Role";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { TabSelection } from "@/utils/other/TabSelection";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
    collapsed: [
        "profile" | "posts" | null,
        React.Dispatch<React.SetStateAction<"profile" | "posts" | null>>,
    ];
};

export const ProfileOverview = ({
    data,
    collapsed: [collapsed, setCollapsed],
}: Props) => {
    // react states
    const [field, setField] = useState<"Bio" | "Status" | null>(
        data.profile.bio ? "Bio" : data.profile.status ? "Status" : null,
    );

    return (
        <div className="flex flex-col gap-4">
            <ul className="box bg-bg-2! p-0! h-10! rounded-full! flex-row! items-center">
                <li>
                    <Tooltip text="Collapse / Expand">
                        <Button
                            className="p-0!"
                            onClick={() =>
                                setCollapsed((prev) =>
                                    prev === "profile" ? null : "profile",
                                )
                            }
                        >
                            <Image
                                alt=""
                                width={20}
                                height={20}
                                src="/collapse.svg"
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    collapsed === "profile"
                                        ? "var(--orange-1)"
                                        : "var(--blue-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/account.svg"
                    />
                    <span>Profile:</span>
                </li>
            </ul>

            <div
                className={`grid overflow-hidden transition-all duration-500 
                    ${collapsed === "profile" ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
            >
                <ul className="flex flex-col w-full gap-4 grow items-center overflow-hidden">
                    <li className="flex flex-col items-center">
                        <span className="text-4! text-foreground-3!">
                            {data.profile.name}
                        </span>
                    </li>

                    <li className="w-3/12!">
                        <hr />
                    </li>

                    <li className="flex flex-col gap-2 items-center">
                        {data.profile.title && (
                            <span>{data.profile.title}</span>
                        )}

                        <ProfileImage
                            profile={data.profile}
                            width={256}
                            height={256}
                            className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                            style={{
                                outlineColor:
                                    data.profile.color ?? "transparent",
                            }}
                        />
                    </li>

                    <li>
                        {data.profile.color && <ColorSwatches data={data} />}
                    </li>

                    <li>
                        <ul className="flex items-center gap-2">
                            {data.profile.gender && (
                                <li>
                                    <Gender data={data} />
                                </li>
                            )}
                            <li>
                                <Role data={data} />
                            </li>
                        </ul>
                    </li>

                    <li className="w-3/12!">
                        <hr />
                    </li>

                    {(data.profile.bio || data.profile.status) && (
                        <li className="flex flex-col items-center gap-1">
                            <Button
                                isEnabled={
                                    !!(data.profile.bio && data.profile.status)
                                }
                                onClick={() => {
                                    setField((prev) =>
                                        prev === "Bio" ? "Status" : "Bio",
                                    );
                                }}
                            >
                                <small className="flex gap-1">
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/menu.svg"
                                    />
                                    <span>Field ({field})</span>
                                </small>
                            </Button>

                            <motion.span
                                key={field}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {field === "Bio"
                                    ? data.profile.bio
                                    : data.profile.status}
                            </motion.span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
