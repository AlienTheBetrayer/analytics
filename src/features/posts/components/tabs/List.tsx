import { NoPosts } from "@/features/posts/components/errors/NoPosts";
import { PostCompact } from "@/features/posts/components/parts/PostCompact";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import React from "react";

type Props = {
    data: { user: User; profile: Profile };
};

export const List = ({ data }: Props) => {
    // zustand
    const postIds = useAppStore((state) => state.postIds);
    const posts = useAppStore((state) => state.posts);

    // fallbacks
    if (!postIds[data.user.username]?.length) {
        return <NoPosts data={data} />;
    }

    const postsData = Object.values(postIds[data.user.username]).map(
        (id) => posts[id],
    );

    // main jsx
    return (
        <ul className="flex flex-col gap-8">
            {postsData.map((postData) => (
                <React.Fragment key={postData.id}>
                    <PostCompact data={postData} />

                    <li>
                        <hr/>
                    </li>
                </React.Fragment>
            ))}
        </ul>
    );
};
