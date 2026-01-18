import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { useState } from "react";

export const Create = () => {
    // react states
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    return (
        <div className="flex flex-col gap-2 grow w-full max-w-4xl mx-auto">
            <form
                className="flex flex-col grow"
                onSubmit={(e) => {
                    e.preventDefault();
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
                            minLength={64}
                            id="content"
                            placeholder="at least 64 characters"
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
