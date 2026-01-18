import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Button } from "@/features/ui/button/components/Button";
import { ImageSelect } from "@/features/ui/fileselect/components/ImageSelect";
import { Input } from "@/features/ui/input/components/Input";
import { promiseStatus } from "@/utils/other/status";
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
        <div className="flex flex-col gap-2 grow w-full max-w-4xl mx-auto">
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
                        <hr />
                    </li>

                    <li className="flex flex-col">
                        <ImageSelect
                            sizeLimit={1}
                            value={image}
                            onSelect={(file) => {
                                console.log("HERE!", file);
                                setImage(file);
                            }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/launch.svg"
                            />
                            Add an image
                            {image && (
                                <Image
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                                    alt=""
                                    width={12}
                                    height={12}
                                    src="/checkmark.svg"
                                />
                            )}
                        </ImageSelect>
                    </li>

                    <li>
                        <hr />
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
                        <hr />
                    </li>

                    <li className="flex flex-col">
                        <Button type="submit">
                            {promiseStatus(promises.updatePost)}
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
