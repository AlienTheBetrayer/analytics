import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { PostImagesGrid } from "@/features/posts/components/parts/list/PostImagesGrid";
import { PostsAuthor } from "@/features/posts/components/parts/list/PostsAuthor";
import { ListTopline } from "@/features/posts/components/parts/listtopline/ListTopline";
import { usePostList } from "@/features/posts/hooks/usePostList";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: { user: User; profile: Profile };
};

export const List = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const display = useLocalStore((state) => state.display);
    // processed posts
    const { filtered } = usePostList(data.user);

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

            <li>
                <ListTopline />
            </li>

            <li>
                <hr />
            </li>

            <li>
                <ul
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${display.view.postsColumns}, 1fr)`,
                        gap: `${4.5 - Number(display.view.postsColumns)}rem`,
                    }}
                >
                    {promises.getPosts === "pending"
                        ? Array.from({ length: 8 }, (_, k) => (
                              <li
                                  className="flex flex-col gap-4"
                                  key={k}
                              >
                                  <div className="w-full flex flex-col h-48 rounded-4xl! loading p-0!">
                                      <div className="w-full h-10 loading" />
                                      <Spinner className="m-auto" />
                                  </div>
                                  <hr />
                              </li>
                          ))
                        : filtered.map((post) => (
                              <li
                                  className="flex flex-col gap-4"
                                  key={post.id}
                              >
                                  <PostCompact data={post} />
                                  <hr />
                              </li>
                          ))}
                </ul>
            </li>
        </ul>
    );
};
