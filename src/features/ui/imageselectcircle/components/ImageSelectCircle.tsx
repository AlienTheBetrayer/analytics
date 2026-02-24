import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
    value: string;
    onChange: (file: File | null) => void;
    onError?: (file: File) => void;
    mbLimit?: number;
    className?: string;
};

export const ImageSelectCircle = ({
    value,
    onChange,
    onError,
    mbLimit = 1,
    className,
}: Props) => {
    // internal states & refs
    const [selected, setSelected] = useState<File | undefined>(undefined);
    const [error, setError] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // error timeout
    useEffect(() => {
        if (!error) {
            return;
        }

        const t = setTimeout(() => setError(false), 5000);
        return () => clearTimeout(t);
    }, [error]);

    // cancellation fix for modals
    useEffect(() => {
        const ref = inputRef.current;
        if (!ref) {
            return;
        }

        const handle = (e: Event) => {
            e.stopPropagation();
        };
        ref.addEventListener("cancel", handle);
        return () => ref.removeEventListener("cancel", handle);
    }, []);

    return (
        <div className="relative w-fit h-fit">
            <input
                type="file"
                ref={inputRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];

                    if (!file) {
                        return;
                    }

                    if (file.size > (mbLimit ?? 1) * 1024 * 1024) {
                        onError?.(file);
                        setError(true);
                        return;
                    }

                    setSelected(file);
                }}
                accept="image/*"
                className="hidden"
                tabIndex={-1}
            />

            <Button
                className={`p-0! group  outline-2 hover:outline-blue-1! duration-400! not-hover:rounded-[6rem]! hover:rounded-[5rem]!
                    ${className ?? ""}`}
                onClick={() => {
                    inputRef.current?.click();
                }}
            >
                {/* images */}
                <AnimatePresence>
                    {value || selected ? (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0 }}
                            className="absolute inset-0"
                            key="img"
                        >
                            <Image
                                fill
                                style={{ objectFit: "cover" }}
                                alt="image"
                                className="invert-0! rounded-full"
                                src={
                                    selected
                                        ? URL.createObjectURL(selected)
                                        : value
                                }
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0 }}
                            className="absolute inset-0 flex items-center justify-center group"
                            key="select"
                        >
                            <Image
                                alt="select"
                                width={24}
                                height={24}
                                src="/imageadd.svg"
                                className="duration-500! group-hover:scale-150! group-focus-visible:scale-150!"
                            />
                            <div className="absolute inset-0 loading z-2" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* error message */}
                <AnimatePresence>
                    {error && (
                        <motion.span
                            initial={{ opacity: 0, y: 8, scale: 0.75 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.75 }}
                            transition={{ type: "spring", bounce: 0 }}
                            className="absolute bottom-6 flex items-center gap-1"
                        >
                            <div className="w-1 h-1 rounded-full bg-red-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cross.svg"
                            />
                            Size {">"} {mbLimit}MB!
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>

            {/* buttons */}
            <AnimatePresence>
                {(selected || value) && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.75 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.75 }}
                        transition={{ type: "spring", bounce: 0 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-blend-difference"
                    >
                        {selected ? (
                            <>
                                <Tooltip text="Cancel">
                                    <Button
                                        onClick={() => {
                                            setSelected(undefined);
                                            if (inputRef.current) {
                                                inputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/cross.svg"
                                        />
                                    </Button>
                                </Tooltip>

                                <Tooltip text="Confirm">
                                    <Button
                                        className="border-awaiting"
                                        onClick={() => {
                                            onChange(selected);
                                            setSelected(undefined);
                                            if (inputRef.current) {
                                                inputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/checkmark.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            </>
                        ) : (
                            value && (
                                <Tooltip text="Delete">
                                    <Button
                                        onClick={() => {
                                            onChange(null);
                                        }}
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/delete.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
