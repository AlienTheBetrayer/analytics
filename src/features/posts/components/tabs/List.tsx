import { PostCompact } from "@/features/posts/components/parts/PostCompact";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
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
            {postsData.map((postData) => (
                <React.Fragment key={postData.id}>
                    <li>
                        <PostCompact data={postData} />
                    </li>

                    <li>
                        <hr />
                    </li>
                </React.Fragment>
            ))}

            {promises.getPosts === "pending" &&
                Array.from({ length: 2 }, (_, k) => (
                    <li
                        className="w-full grid place-items-center h-32 rounded-4xl! loading"
                        key={k}
                    >
                        <Spinner className="w-5" />
                    </li>
                ))}
        </ul>
    );
};
