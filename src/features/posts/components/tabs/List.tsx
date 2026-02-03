import { NoPosts } from "@/features/posts/components/parts/errors/NoPosts";
import { PostImagesGrid } from "@/features/posts/components/parts/list/PostImagesGrid";
import { PostList } from "@/features/posts/components/parts/list/PostList";
import { PostsAuthor } from "@/features/posts/components/parts/list/PostsAuthor";
import { ListTopline } from "@/features/posts/components/parts/listtopline/ListTopline";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const List = ({ data }: Props) => {
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
                <ListTopline data={data} />
            </li>

            <li>
                <hr />
            </li>

            <li>
                <PostsView data={data} />
            </li>
        </ul>
    );
};

type PostsProps = {
    data: CacheAPIProtocol["user"]["data"];
};
const PostsView = ({ data }: PostsProps) => {
    const { data: posts, isLoading } = useQuery({ key: ["posts", data.id] });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="w-full h-32 loading"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    if (!posts?.length) {
        return <NoPosts />;
    }

    return <PostList data={data} />;
};
