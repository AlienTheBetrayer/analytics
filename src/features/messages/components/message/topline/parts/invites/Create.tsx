/** @format */

import { Button } from "@/features/ui/button/components/Button";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { createInvitation } from "@/query-api/calls/invitations";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

export const Create = () => {
    // states
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [image, setImage] = useState<File>();

    // zustand
    const conversation = useAppStore((state) => state.conversation);

    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return (
        <div className="flex flex-col gap-2 items-center">
            <ImageSelectCircle
                className="w-32! aspect-square"
                value={imageURL}
                onChange={(value) => {
                    setImage(value ?? undefined);

                    if (value) {
                        setImageURL(URL.createObjectURL(value));
                    }
                }}
            />

            <Input
                placeholder="Description..."
                value={description}
                onChange={(value) => setDescription(value)}
            />

            <Button
                className="w-full"
                onClick={() => {
                    wrapPromise("createInvitation", () => {
                        return createInvitation({
                            description,
                            image,
                            conversation_id: conversation.id,
                        });
                    });
                }}
            >
                <PromiseState state="createInvitation" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
                Create
            </Button>
        </div>
    );
};
