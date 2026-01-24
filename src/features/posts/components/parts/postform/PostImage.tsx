import { Button } from "@/features/ui/button/components/Button";
import { FileSelect } from "@/features/ui/fileselect/components/FileSelect";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { useAppStore } from "@/zustand/store";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";

type Props = {
    image: File | undefined | null;
    setImage: React.Dispatch<React.SetStateAction<File | undefined | null>>;
};

export const PostImage = React.memo(function PostImageComponent({
    image,
    setImage,
}: Props) {
    // url
    const { id } = useParams<{ id?: string }>();

    // zustand
    const posts = useAppStore((state) => state.posts);

    // refs
    const selectRef = useRef<HTMLInputElement | null>(null);

    // ui states
    const img =
        image !== null
            ? image
                ? URL.createObjectURL(image)
                : id && posts[id]?.image_url
            : undefined;
    const [error, setError] = useState<boolean>(false);

    // messageboxes
    const deleteBox = useMessageBox();

    // fallbacks / jsx
    return (
        <div className="relative flex flex-col-reverse p-1 group items-center gap-2 w-full h-81 overflow-hidden">
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
                sizeLimit={1}
                ref={selectRef}
            />

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="flex items-center gap-1 absolute left-1/2 -translate-1/2 top-6 z-2"
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
                className={`absolute! inset-0 rounded-4xl! w-full! ${img ? "border-2! border-blue-1!" : "border-0!"}`}
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

                <Image
                    alt="add an image"
                    width={64}
                    height={64}
                    src="/imageadd.svg"
                    className={`
                            ${img ? "opacity-0" : ""}
                            absolute left-1/2 top-1/2 -translate-1/2
                            invert-100!
                            group-hover:scale-105 group-focus-within:scale-105 
                            group-hover:opacity-100 group-focus-within:opacity-100
                            hover:scale-125
                            transition-all! duration-500! ease-in-out!
                            mix-blend-difference
                        `}
                />
            </Button>

            <div className="flex justify-center w-full rounded-full z-1 backdrop-blur-xl">
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
