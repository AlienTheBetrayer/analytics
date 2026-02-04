import Image from "next/image";
import { FriendButton } from "./FriendButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { ProfileOverview } from "@/features/profile/components/tabs/overview/ProfileOverview";
import { PostsOverview } from "@/features/profile/components/tabs/overview/PostsOverview";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { motion } from "motion/react";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Overview = ({ data }: Props) => {
    // react states
    const collapsed = useState<"profile" | "posts" | null>(null);
    const [dateview, setDateview] = useState<"seen" | "created">("seen");

    return (
        <div className="flex flex-col gap-4">
            <ul className="flex flex-col items-center">
                <li className="flex gap-1 items-center self-end">
                    <Button
                        onClick={() =>
                            setDateview((prev) =>
                                prev === "seen" ? "created" : "seen",
                            )
                        }
                    >
                        <motion.div
                            className="flex gap-1 items-center"
                            key={dateview}
                            initial={{ y: 5 }}
                            animate={{ y: 0 }}
                        >
                            {dateview === "seen" ? (
                                <>
                                    <Image
                                        width={16}
                                        height={16}
                                        alt=""
                                        src="/calendar.svg"
                                    />
                                    <span className="whitespace-nowrap">
                                        seen {relativeTime(data.last_seen_at)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Image
                                        width={16}
                                        height={16}
                                        alt=""
                                        src="/plus.svg"
                                    />
                                    <span className="whitespace-nowrap">
                                        created {relativeTime(data.created_at)}
                                    </span>
                                </>
                            )}
                        </motion.div>
                    </Button>
                </li>

                <li className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/book.svg"
                    />
                    <span className="text-foreground-2! flex">
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </li>

                <li>
                    <span>Profile overview</span>
                </li>
            </ul>

            <hr />

            <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4">
                <ProfileOverview
                    data={data}
                    collapsed={collapsed}
                />
                <PostsOverview
                    data={data}
                    collapsed={collapsed}
                />
            </div>

            <FriendButton data={data} />
        </div>
    );
};
