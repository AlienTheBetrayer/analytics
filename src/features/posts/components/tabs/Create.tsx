import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Button } from "@/features/ui/button/components/Button";
import { ImageSelect } from "@/features/ui/fileselect/components/ImageSelect";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

export const Create = () => {
    // react states
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    // zustand
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);
    const updatePost = useAppStore((state) => state.updatePost);

    return (
        <div className="flex flex-col gap-4 grow w-full max-w-4xl mx-auto">
            <div className="flex gap-1 items-center justify-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubeadd.svg"
                />
                <span>Post publishing</span>
            </div>

            <hr />

            <form
                className="flex flex-col grow"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!status) {
                        return;
                    }

                    updatePost({
                        user_id: status.id,
                        type: "create",
                        data: {
                            title,
                            content,
                            image:
                                image === null
                                    ? null
                                    : await fileToBase64(image),
                        },
                    });
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

                        <ImageSelect
                            id="image"
                            sizeLimit={1}
                            value={image}
                            onSelect={(file) => {
                                setImage(file);
                            }}
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
                            required
                            minLength={32}
                            maxLength={512}
                            id="content"
                            placeholder="at least 32 characters"
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
        </div>
    );
};
