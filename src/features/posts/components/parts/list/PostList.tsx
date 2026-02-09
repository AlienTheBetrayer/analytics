import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { usePostList } from "@/features/posts/hooks/usePostList";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";
import { useEffect } from "react";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const PostList = ({ data }: Props) => {
    // zustand
    const display = useLocalStore((state) => state.display);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);

    // processed posts
    const { filtered } = usePostList(data);

    // media
    const isMobile = useMediaQuery("(max-width:640px)");

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        updateDisplay({ view: { postsColumns: "1" } });
    }, [isMobile, updateDisplay]);

    return (
        <ul
            className="grid gap-1 sm:gap-2 md:gap-4"
            style={{
                gridTemplateColumns: `repeat(${!isMobile ? display.view.postsColumns : Number(display.view.postsColumns) > 2 ? 1 : display.view.postsColumns}, 1fr)`,
            }}
        >
            {!filtered
                ? Array.from({ length: 8 }, (_, k) => (
                      <li
                          className="flex flex-col gap-4"
                          key={k}
                      >
                          <div className="w-full flex flex-col h-48 rounded-4xl! loading p-0!">
                              <div className="w-full h-10 loading" />
                          </div>
                      </li>
                  ))
                : filtered.map((post) => (
                      <li
                          className="flex flex-col gap-4"
                          key={post.id}
                      >
                          <PostCompact id={post.id} />
                      </li>
                  ))}
        </ul>
    );
};
