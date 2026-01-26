import { NoPosts } from "@/features/posts/components/parts/errors/NoPosts";
import { PostImagesGrid } from "@/features/posts/components/parts/list/PostImagesGrid";
import { PostList } from "@/features/posts/components/parts/list/PostList";
import { PostsAuthor } from "@/features/posts/components/parts/list/PostsAuthor";
import { ListTopline } from "@/features/posts/components/parts/listtopline/ListTopline";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: { user: User; profile: Profile };
};

export const List = ({ data }: Props) => {
    // zustand
    const postIds = useAppStore((state) => state.postIds);

    return (
        <ul className="flex flex-col gap-8">
            <li className="grid lg:grid-cols-[30%_auto_1fr] gap-8 lg:gap-4">
                <PostsAuthor data={data} />
                <hr className="lg:w-px! lg:h-1/2! self-center" />
                <PostImagesGrid data={data} />
            </li>

            <li>
                <hr />
            </li>

            <li className="sticky! top-16! z-2 bg-background-3! rounded-full">
                <ListTopline data={data}/>
            </li>

            <li>
                <hr />
            </li>

            <li>
                {postIds[data.user.username]?.size ? (
                    <PostList data={data} />
                ) : (
                    <NoPosts />
                )}
            </li>
        </ul>
    );
};
