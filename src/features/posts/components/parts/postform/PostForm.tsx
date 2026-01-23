import { PostImage } from "@/features/posts/components/parts/postform/PostImage";
import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { PostData } from "@/types/zustand/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
    mode: "create" | "edit";
};

export const PostForm = ({ mode }: Props) => {
    // url
    const { id } = useParams<{ id?: string }>();

    // zustand
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);
    const posts = useAppStore((state) => state.posts);
    const updatePost = useAppStore((state) => state.updatePost);

    // react states
    const [title, setTitle] = useState<string>(
        mode === "create" ? "" : posts[id!].title,
    );
    const [content, setContent] = useState<string>(
        mode === "create" ? "" : (posts[id!]?.content ?? ""),
    );
    const [image, setImage] = useState<File | undefined | null>(undefined);

    return (
        <form
            className="flex flex-col grow"
            onSubmit={async (e) => {
                e.preventDefault();

                if (!status) {
                    return;
                }

                const data: PostData = {
                    title,
                    content,
                };

                // editing / uploading
                if (image) {
                    data.image = await fileToBase64(image);
                    data.image_name = image.name;
                    data.image_type = image.type;
                }

                // deletion
                if (image === null) {
                    data.image = null;
                }

                switch (mode) {
                    case "create": {
                        updatePost({
                            user_id: status.id,
                            type: "create",
                            data,
                        });
                        break;
                    }
                    case "edit": {
                        updatePost({
                            user_id: status.id,
                            type: "edit",
                            id: id!,
                            data,
                        });
                        break;
                    }
                }
            }}
        >
            <ul className="flex flex-col gap-4 grow">
                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="title"
                        className="flex gap-1 items-center justify-center"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/menu.svg"
                        />
                        Title
                    </label>
                    <Input
                        id="title"
                        required
                        minLength={8}
                        maxLength={64}
                        placeholder="at least 8 characters"
                        value={title}
                        onChange={(value) => setTitle(value)}
                    />
                </li>

                <li>
                    <hr className="mt-4" />
                </li>

                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="image"
                        className="flex gap-1 items-center justify-center"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/moon.svg"
                        />
                        Image
                    </label>
                    <PostImage
                        image={image}
                        setImage={setImage}
                    />
                </li>

                <li>
                    <hr className="mt-4" />
                </li>

                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="content"
                        className="flex gap-1 items-center justify-center"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/pencil.svg"
                        />
                        Content
                    </label>

                    <Input
                        maxLength={512}
                        id="content"
                        placeholder="512 characters max"
                        style={{
                            minHeight: "15rem",
                            maxHeight: "40rem",
                        }}
                        as="textarea"
                        className="self-stretch grow rounded-3xl!"
                        value={content}
                        onChange={(value) => setContent(value)}
                    />
                </li>

                <li>
                    <hr className="mt-4" />
                </li>

                <li className="flex flex-col">
                    <Button type="submit">
                        <PromiseStatus status={promises.updatePost} />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cubeadd.svg"
                        />
                        Publish
                    </Button>
                </li>
            </ul>
        </form>
    );
};
