import { Button } from "@/features/ui/button/components/Button";
import { FileSelect } from "@/features/ui/fileselect/components/FileSelect";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { useQuery } from "@/query/core";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const FILE_LIMIT = 1;

type Props = {
    image: File | undefined | null;
    setImage: React.Dispatch<React.SetStateAction<File | undefined | null>>;
    id?: string;
};

export const PostImage = React.memo(function PostImageComponent({
    image,
    id,
    setImage,
}: Props) {
    // fetching
    const { data: post } = useQuery({ key: ["post", id] });

    // refs
    const selectRef = useRef<HTMLInputElement | null>(null);

    // ui states
    const [dragging, setDragging] = useState<boolean>(false);
    const img =
        image !== null
            ? image
                ? URL.createObjectURL(image)
                : post?.image_url
            : undefined;

    const [error, setError] = useState<boolean>(false);

    // messageboxes
    const deleteBox = useMessageBox();

    // fallbacks / jsx
    return (
        <div
            className="relative flex flex-col-reverse p-1 group items-center gap-2 w-full h-81 overflow-hidden"
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => {
                setDragging(false);
            }}
            onDrop={(e) => {
                setDragging(false);
                e.preventDefault();
                const file = e.dataTransfer.files[0];

                if (!file || !file.type.startsWith("image/")) {
                    return;
                }

                if (file.size / 1024 / 1024 > FILE_LIMIT) {
                    setError(true);
                    setTimeout(() => {
                        setError(false);
                    }, 10000);
                    return;
                }

                setImage(file);
            }}
        >
            {deleteBox.render({
                children:
                    "After you apply changes the post's image is going to be gone",
                onSelect: (res) => {
                    if (res === "yes") {
                        setImage(null);
                    }
                },
            })}

            <FileSelect
                onSelect={(file) => {
                    setImage(file ?? undefined);
                }}
                onError={() => {
                    setError(true);
                    setTimeout(() => {
                        setError(false);
                    }, 10000);
                }}
                sizeLimit={FILE_LIMIT}
                ref={selectRef}
            />

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="flex items-center gap-1 absolute left-1/2 -translate-1/2 top-6 z-1 backdrop-blur-2xl p-2! rounded-full"
                        initial={{ opacity: 0, scale: 0.5, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -50 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 30,
                        }}
                    >
                        <em>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/warning.svg"
                            />
                        </em>

                        <span>
                            <em>
                                <u>Error</u>: File size cannot exceed 1MB
                            </em>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                className={`absolute! inset-0 rounded-4xl! w-full! ${img || dragging ? "border-2! border-blue-1!" : "border-0!"}`}
                onClick={() => {
                    selectRef.current?.click();
                }}
            >
                {img && (
                    <Image
                        alt="post image"
                        fill
                        style={{ objectFit: "cover" }}
                        src={img}
                        className="invert-0! group-hover:scale-105 group-focus-within:scale-105 transition-[scale]! duration-1000!"
                    />
                )}

                <div
                    className={`flex flex-col gap-2 absolute left-1/2 top-1/2 -translate-1/2 items-center
                        group-hover:scale-125 group-focus-within:scale-125 
                        group-hover:opacity-100 group-focus-within:opacity-100
                        transition-all! duration-500! ease-in-out!
                        ${img ? "opacity-0" : ""}
                    `}
                >
                    <Image
                        alt="add an image"
                        width={64}
                        height={64}
                        src="/imageadd.svg"
                        className="invert-100! mix-blend-difference"
                    />
                    <span className={``}>Drag & Drop</span>
                </div>
            </Button>

            <div className="flex justify-center w-full rounded-full z-2 backdrop-blur-xl">
                <ul className="grid grid-cols-2 w-full max-w-96 gap-2 p-1!">
                    <li>
                        <Button
                            className="w-full"
                            onClick={() => {
                                selectRef.current?.click();
                            }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/pencil.svg"
                            />
                            Change
                        </Button>
                    </li>

                    <li>
                        <Button
                            className="w-full"
                            onClick={deleteBox.show}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                            Delete
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
});
