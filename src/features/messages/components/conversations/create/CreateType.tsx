import { useCreateConversation } from "@/features/messages/hooks/useCreateConversation";
import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { Button } from "@/features/ui/button/components/Button";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Input } from "@/features/ui/input/components/Input";
import { Conversation } from "@/types/tables/messages";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
    category: Conversation["type"];
    type: "friends" | "users" | "both";
};

export const CreateType = ({ type, category }: Props) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selected, setSelected] = useState<Props["type"]>(type);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [validity, setValidity] = useState<boolean>(false);

    const { create } = useCreateConversation();

    return (
        <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 relative w-full"
        >
            {selected !== "both" && (
                <ul className="box acrylic w-full p-4! flex flex-col items-center gap-2">
                    <li className="flex items-center">
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/plus.svg"
                            />
                        </span>
                    </li>

                    <li className="w-full">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            onChange={(e) => {
                                setValidity(e.currentTarget.checkValidity());
                            }}
                        >
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center justify-center">
                                    <ImageSelectCircle
                                        value={
                                            image
                                                ? URL.createObjectURL(image)
                                                : ""
                                        }
                                        onChange={(file) => {
                                            setImage(file ?? undefined);
                                        }}
                                        className="w-screen max-w-32 aspect-square"
                                    />
                                </li>

                                <li className="w-full">
                                    <Input
                                        required
                                        placeholder="title..."
                                        value={title}
                                        onChange={(value) => setTitle(value)}
                                    />
                                </li>

                                <li className="w-full">
                                    <Input
                                        placeholder="description..."
                                        value={description}
                                        onChange={(value) =>
                                            setDescription(value)
                                        }
                                    />
                                </li>
                            </ul>
                        </form>
                    </li>
                </ul>
            )}

            {selected !== "both" && type === "both" && (
                <Button
                    className="flex! absolute! right-11 top-2 items-center justify-center rounded-lg! min-w-6! min-h-6! w-6! h-6! p-0! z-1"
                    onClick={() => {
                        setSelected("both");
                    }}
                >
                    <Image
                        alt=""
                        width={14}
                        height={14}
                        src="/back.svg"
                    />
                </Button>
            )}

            {(() => {
                switch (selected) {
                    case "users": {
                        return (
                            <MiniSearch
                                required={category === "dm"}
                                text="Create"
                                isEnabled={validity}
                                type="users"
                                view="select"
                                onSelect={(ids) => {
                                    create({
                                        type: category,
                                        ids,
                                        title,
                                        description,
                                        image,
                                    });
                                }}
                                promiseState="createConversation"
                            />
                        );
                    }
                    case "friends": {
                        return (
                            <MiniSearch
                                required={category === "dm"}
                                text="Create"
                                isEnabled={validity}
                                type="friends"
                                view="select"
                                onSelect={(ids) =>
                                    create({
                                        type: category,
                                        ids,
                                        title,
                                        description,
                                        image,
                                    })
                                }
                                promiseState="createConversation"
                            />
                        );
                    }
                    case "both": {
                        return (
                            <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
                                <li className="flex items-center gap-1 self-center mb-6!">
                                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/type.svg"
                                    />
                                </li>

                                <li>
                                    <Button
                                        onClick={() => setSelected("friends")}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/friends.svg"
                                        />
                                        <span>Friends</span>
                                    </Button>
                                </li>

                                <li>
                                    <Button
                                        onClick={() => setSelected("users")}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/account.svg"
                                        />
                                        <span>Users</span>
                                    </Button>
                                </li>
                            </ul>
                        );
                    }
                }
            })()}
        </motion.div>
    );
};
