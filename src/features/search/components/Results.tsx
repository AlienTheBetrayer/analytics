import { PostDisplay } from "@/features/search/components/PostDisplay";
import { ProfileDisplay } from "@/features/search/components/ProfileDisplay";
import { SearchResults } from "@/types/zustand/user";
import Image from "next/image";
import React from "react";

type Props = {
    data: SearchResults;
};

export const Results = ({ data }: Props) => {
    return (
        <ul className="flex flex-col gap-8">
            <li className="flex flex-col items-center gap-1 self-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />

                <div className="flex items-center gap-2">
                    <span>
                        <mark>
                            Results: {data.users.length + data.posts.length}
                        </mark>
                    </span>
                </div>
            </li>

            <li className="w-1/3 self-center">
                <hr />
            </li>

            {!!data.users.length && (
                <li className="flex gap-1 items-center justify-center">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/account.svg"
                    />
                    <span>Users:</span>
                </li>
            )}

            <ul className="flex flex-col gap-4">
                {data.users.map(({ profile, user }, idx) => (
                    <React.Fragment key={user.id}>
                        <li>
                            <ProfileDisplay data={{ user, profile }} />
                        </li>

                        {idx < data.users.length - 1 && (
                            <li>
                                <hr />
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ul>

            {!!(data.users.length && data.posts.length) && <hr />}

            {!!data.posts.length && (
                <li className="flex gap-1 items-center justify-center">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/select.svg"
                    />
                    <span>Posts:</span>
                </li>
            )}

            <ul className="flex flex-col gap-4">
                {data.posts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                        <li>
                            <PostDisplay data={post} />
                        </li>

                        {idx < data.posts.length - 1 && (
                            <li>
                                <hr />
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </ul>
    );
};
