/** @format */

import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props = {
    hide: () => void;
};

export const EditingMenu = ({ hide }: Props) => {
    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const messages = useAppStore((state) => state.messages);

    // states
    const [title, setTitle] = useState<string>(conversation?.title ?? "");
    const [description, setDescription] = useState<string>(conversation?.description ?? "");
    const [pinned, setPinned] = useState<boolean>(conversation?.conversation_meta?.pinned ?? false);
    const [archived, setArchived] = useState<boolean>(conversation?.conversation_meta?.archived ?? false);
    const [image, setImage] = useState<string>(conversation?.image_url ?? "");
    const [changedImage, setChangedImage] = useState<File | undefined | null>(undefined);

    // fallback
    if (!conversation || !messages) {
        return null;
    }

    // jsx
    return (
        <div className="box p-4! acrylic w-full">
            <span className="flex items-center justify-center gap-1 mb-6!">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/pencil.svg"
                />
            </span>

            <form
                className="w-full"
                onSubmit={(e) => {
                    e.preventDefault();

                    wrapPromise("updateConversation", async () => {
                        return upsertConversation({
                            type: "edit",
                            conversation_id: conversation.id,
                            title,
                            description,
                            ...(changedImage !== undefined && {
                                image: changedImage,
                            }),
                            pinned,
                            archived,
                        });
                    }).then(() => {
                        hide();
                    });
                }}
            >
                <ul className="flex flex-col items-center gap-2 w-full *:w-full">
                    {conversation.type !== "dm" && (
                        <li className="flex items-center justify-center">
                            <ImageSelectCircle
                                value={image}
                                onChange={(file) => {
                                    setImage(file ? URL.createObjectURL(file) : "");
                                    setChangedImage(file);
                                }}
                                className="w-screen max-w-48 aspect-square"
                            />
                        </li>
                    )}

                    <li>
                        <hr />
                    </li>

                    <li>
                        <Input
                            placeholder="Title..."
                            value={title}
                            onChange={(value) => setTitle(value)}
                        />
                    </li>

                    <li>
                        <Input
                            placeholder="Description..."
                            value={description}
                            onChange={(value) => setDescription(value)}
                        />
                    </li>

                    <li className="my-1!">
                        <hr />
                    </li>

                    <li>
                        <Checkbox
                            value={pinned}
                            onToggle={(value) => setPinned(value)}
                        >
                            Pinned
                        </Checkbox>
                    </li>

                    <li>
                        <Checkbox
                            value={archived}
                            onToggle={(value) => setArchived(value)}
                        >
                            Archived
                        </Checkbox>
                    </li>

                    <li className="my-1!">
                        <hr />
                    </li>

                    <li>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <PromiseState state="updateConversation" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/pencil.svg"
                            />
                            Save changes
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
