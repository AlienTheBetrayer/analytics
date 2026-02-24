import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    hide: () => void;
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
    data: CacheAPIProtocol["messages"]["data"];
};

export const EditingMenu = ({ conversationData, data, hide }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // states
    const [title, setTitle] = useState<string>(conversationData.title ?? "");
    const [description, setDescription] = useState<string>(
        conversationData.description ?? "",
    );
    const [pinned, setPinned] = useState<boolean>(
        conversationData.conversation_meta?.pinned ?? false,
    );
    const [archived, setArchived] = useState<boolean>(
        conversationData.conversation_meta?.archived ?? false,
    );
    const [image, setImage] = useState<string>(
        conversationData.image_url ?? "",
    );
    const [changedImage, setChangedImage] = useState<File | undefined | null>(
        undefined,
    );

    return (
        <div className="box p-4! acrylic w-screen max-w-lg">
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

                    if (!status || !data) {
                        return;
                    }

                    wrapPromise("updateConversation", async () => {
                        return upsertConversation({
                            type: "edit",
                            user: status,
                            conversation_id: conversationData.id,
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
