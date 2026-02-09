import { PostImage } from "@/features/posts/components/parts/postform/PostImage";
import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { PostData, updatePost } from "@/query-api/calls/posts";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    mode: "create" | "edit";
    id?: string;
};

export const PostForm = ({ mode, id }: Props) => {
    // fetching
    const { data: post } = useQuery({ key: ["post", id] });
    const { data: status } = useQuery({ key: ["status"] });

    // react states
    const [title, setTitle] = useState<string>(
        mode === "create" ? "" : (post?.title ?? ""),
    );
    const [content, setContent] = useState<string>(
        mode === "create" ? "" : (post?.content ?? ""),
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

                wrapPromise("updatePost", () => {
                    switch (mode) {
                        case "create": {
                            return updatePost({
                                user_id: status.id,
                                type: "create",
                                data,
                            });
                        }
                        case "edit": {
                            return updatePost({
                                user_id: status.id,
                                type: "edit",
                                id: id!,
                                data,
                            });
                        }
                    }
                });
            }}
        >
            <ul className="flex flex-col gap-12 grow">
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
                        id={id}
                        image={image}
                        setImage={setImage}
                    />
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

                <li className="flex flex-col">
                    <Button type="submit">
                        <PromiseState state="updatePost" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cubeadd.svg"
                        />
                        {mode === "create" ? "Publish" : "Edit"}
                    </Button>
                </li>
            </ul>
        </form>
    );
};
