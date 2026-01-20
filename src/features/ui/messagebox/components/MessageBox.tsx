import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDisabledScroll } from "@/hooks/useDisabledScroll";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";

type Props = {
    visibility: boolean;
    children: React.ReactNode;
    onSelect: (response: "yes" | "no") => void;
};

export const MessageBox = ({ visibility, children, onSelect }: Props) => {
    // states
    const [mounted, setMounted] = useState<boolean>(visibility);
    const { setIsDisabled } = useDisabledScroll();

    // refs
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const yesRef = useRef<HTMLButtonElement | null>(null);

    // visibility handling
    useEffect(() => {
        setIsDisabled(visibility);

        if (visibility) {
            requestAnimationFrame(() => {
                setMounted(true);
            });
        }
    }, [visibility, setIsDisabled]);

    useEffect(() => {
        if (!yesRef.current || !dialogRef.current) {
            return;
        }

        if (mounted) {
            dialogRef.current.showModal();
            yesRef.current?.focus();
        } else {
            dialogRef.current.close();
        }
    }, [mounted]);

    // click away
    useEffect(() => {
        if (!visibility) {
            return;
        }

        const handle = (e: PointerEvent) => {
            if (!dialogRef.current) {
                return;
            }

            const { x, y } = { x: e.clientX, y: e.clientY };

            const bounds = dialogRef.current.getBoundingClientRect();

            if (
                x > bounds.left &&
                x < bounds.right &&
                y > bounds.top &&
                y < bounds.bottom
            ) {
                return;
            }

            onSelect?.("no");
        };

        window.addEventListener("pointerdown", handle);

        return () => {
            window.removeEventListener("pointerdown", handle);
        };
    }, [visibility, onSelect]);

    return (
        mounted && (
            <dialog
                onCancel={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onSelect?.("no");
                }}
                onFocus={(e) => {
                    e.stopPropagation();
                }}
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
                className="m-auto!"
            >
                <AnimatePresence
                    onExitComplete={() => {
                        setMounted(false);
                    }}
                >
                    {visibility && (
                        <motion.div
                            key="blur"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 backdrop-blur-xs"
                        />
                    )}

                    {visibility && (
                        <motion.div
                            key="box"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            className="relative box justify-between w-screen max-w-86 aspect-video backdrop-blur-xl!"
                        >
                            <CloseButton hide={() => onSelect?.("no")} />

                            <div className="flex flex-col gap-1 items-center">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/type.svg"
                                    className="invert-60!"
                                />
                                <span className="text-center text-5! text-foreground-4!">
                                    Are you <u>sure?</u>
                                </span>
                            </div>

                            <span className="text-center w-full">
                                {children}
                            </span>

                            <ul className="grid grid-cols-2 w-full gap-2">
                                <li>
                                    <Button
                                        ref={yesRef}
                                        onClick={() => onSelect?.("yes")}
                                        className="w-full gap-2!"
                                    >
                                        <Image
                                            alt=""
                                            width={12}
                                            height={12}
                                            src="/checkmark.svg"
                                        />
                                        Yes
                                    </Button>
                                </li>

                                <li>
                                    <Button
                                        onClick={() => onSelect?.("no")}
                                        className="w-full gap-2"
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/delete.svg"
                                        />
                                        No
                                    </Button>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </dialog>
        )
    );
};
