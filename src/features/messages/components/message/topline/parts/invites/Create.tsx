import { Button } from "@/features/ui/button/components/Button";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { createInvitation } from "@/query-api/calls/invitations";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const Create = ({ conversationData }: Props) => {
    const [description, setDescription] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [image, setImage] = useState<File>();
    const { data: status } = useQuery({ key: ["status"] });

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
                    if (!status) {
                        return;
                    }

                    wrapPromise("createInvitation", () => {
                        return createInvitation({
                            description,
                            image,
                            user: status,
                            conversation_id: conversationData.id,
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
