import { PostForm } from "@/features/posts/components/parts/postform/PostForm";
import Image from "next/image";

export const Edit = () => {
    return (
        <div className="flex flex-col gap-4 grow w-full mx-auto">
            <div className="flex gap-1 items-center justify-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/pencil.svg"
                />
                <span>Post Editing</span>
            </div>

            <hr />

            <PostForm mode="edit" />
        </div>
    );
};
