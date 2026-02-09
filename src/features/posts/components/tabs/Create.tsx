import { PostForm } from "@/features/posts/components/parts/postform/PostForm";
import Image from "next/image";

export const Create = () => {
    return (
        <div className="flex flex-col gap-8 grow w-full mx-auto">
            <div className="box h-10! p-0! flex-row! flex gap-1 items-center justify-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubeadd.svg"
                />
                <span>Post publishing</span>
            </div>

            <PostForm mode="create" />
        </div>
    );
};
