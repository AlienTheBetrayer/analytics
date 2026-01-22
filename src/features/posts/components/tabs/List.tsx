import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { ListTopline } from "@/features/posts/components/parts/listtopline/ListTopline";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import React from "react";

type Props = {
    data: { user: User; profile: Profile };
};

export const List = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const postIds = useAppStore((state) => state.postIds);
    const posts = useAppStore((state) => state.posts);

    const postsData = Object.values(postIds[data.user.username]).map(
        (id) => posts[id],
    );

    // main jsx
    return (
        <ul className="flex flex-col gap-8">
            <li className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/book.svg"
                />
                <span>{data.user.username}&apos;s posts</span>

                <ProfileImage
                    width={256}
                    height={256}
                    profile={data.profile}
                    className="w-full max-w-64 aspect-square"
                />
            </li>

            <li>
                <hr />
            </li>

            <li>
                <ListTopline/>
            </li>

            <li>
                <ul className="grid gap-12">
                    {postsData.map((postData) => (
                        <li
                            className="flex flex-col gap-4"
                            key={postData.id}
                        >
                            <PostCompact data={postData} />
                            <hr />
                        </li>
                    ))}
                </ul>
            </li>

            {promises.getPosts === "pending" &&
                Array.from({ length: 2 }, (_, k) => (
                    <React.Fragment key={k}>
                        <li className="w-full grid place-items-center h-32 rounded-4xl! loading">
                            <Spinner className="w-5" />
                        </li>

                        <li>
                            <hr />
                        </li>
                    </React.Fragment>
                ))}
        </ul>
    );
};
