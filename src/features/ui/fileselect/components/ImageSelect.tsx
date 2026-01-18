import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Edit } from "@/features/ui/fileselect/components/Edit";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, ComponentPropsWithoutRef, useRef } from "react";

type Props = {
    onSelect?: (file: File | null) => void;
    onError?: (file: File) => void;
    value?: File | null;
    sizeLimit?: number;
} & Omit<ComponentPropsWithoutRef<"input">, "onSelect" | "value">;

export const ImageSelect = ({
    value,
    onSelect,
    onError,
    children,
    className,
    sizeLimit = 0.5,
}: Props) => {
    // states
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<boolean>(false);

    const fileValue = value !== undefined ? value : file;

    // refs
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Tooltip
            className="w-full"
            direction="top"
            disabledPointer={false}
            element={
                fileValue ? (
                    <Edit
                        file={fileValue}
                        onEdit={() => {
                            inputRef.current?.click();
                        }}
                        onDelete={() => {
                            onSelect?.(null);

                            if (onSelect === undefined) {
                                setFile(null);
                            }
                        }}
                    />
                ) : undefined
            }
        >
            <label
                htmlFor="image"
                className={`button outline-1! hover:outline-blue-1! focus:outline-blue-1! focus-within:outline-blue-1! 
            transition-colors duration-200! ${fileValue ? "outline-blue-1!" : ""} ${className ?? ""}`}
            >
                {children}
                <input
                    ref={inputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    className="absolute left-0 top-0 w-0 h-0 opacity-0"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                            return;
                        }

                        // > 1 MB error handling
                        if (file.size / 1024 / 1024 > sizeLimit) {
                            onError?.(file);

                            setError(true);
                            setTimeout(() => {
                                setError(false);
                            }, 10000);

                            return;
                        }

                        onSelect?.(file);

                        if (onSelect === undefined) {
                            setFile(file);
                        }
                    }}
                />

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                width: 0,
                                marginLeft: "0rem",
                                scale: 0.7,
                            }}
                            animate={{
                                opacity: 1,
                                width: "auto",
                                marginLeft: "0.3rem",
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                width: 0,
                                marginLeft: "0rem",
                                scale: 0.5,
                            }}
                            className="ml-2 overflow-hidden"
                        >
                            <span className="whitespace-nowrap">
                                <u>
                                    <small className="flex gap-1 items-center">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/fileerror.svg"
                                        />
                                        {`Max: ${sizeLimit} MB`}
                                    </small>
                                </u>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </label>
        </Tooltip>
    );
};
