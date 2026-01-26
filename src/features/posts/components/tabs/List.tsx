import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { PostImagesGrid } from "@/features/posts/components/parts/list/PostImagesGrid";
import { PostsAuthor } from "@/features/posts/components/parts/list/PostsAuthor";
import { ListTopline } from "@/features/posts/components/parts/listtopline/ListTopline";
import { usePostList } from "@/features/posts/hooks/usePostList";
import { Spinner } from "@/features/spinner/components/Spinner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { useEffect } from "react";

type Props = {
    data: { user: User; profile: Profile };
};

export const List = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const display = useLocalStore((state) => state.display);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);
    // processed posts
    const { filtered } = usePostList(data.user);

    // media
    const isMobile = useMediaQuery("(max-width:640px)");

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        updateDisplay({ view: { postsColumns: "1" } });
    }, [isMobile, updateDisplay]);

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
                <ListTopline />
            </li>

            <li>
                <hr />
            </li>

            <li>
                <ul
                    className="grid gap-1 sm:gap-2 md:gap-4"
                    style={{
                        gridTemplateColumns: `repeat(${!isMobile ? display.view.postsColumns : Number(display.view.postsColumns) > 2 ? 1 : display.view.postsColumns}, 1fr)`,
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
                                  <hr className="my-4!" />
                              </li>
                          ))
                        : filtered?.map((post) => (
                              <li
                                  className="flex flex-col gap-4"
                                  key={post.id}
                              >
                                  <PostCompact data={post} />
                                  <hr className="my-4!" />
                              </li>
                          ))}
                </ul>
            </li>
        </ul>
    );
};
