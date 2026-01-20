"use client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PopoverDirection } from "@/features/ui/popovers/types/popover";
import { positionPopover } from "@/features/ui/popovers/utils/positionPopover";
import { useDisabledScroll } from "@/hooks/useDisabledScroll";

type Props = {
    element?: (hide?: () => void) => React.ReactNode;
    direction?: PopoverDirection;
    className?: string;
    isEnabled?: boolean;
    children: React.ReactNode;
};

export const Modal = React.memo(function ModalFunction({
    element,
    direction = "bottom",
    className = "",
    isEnabled = true,
    children,
}: Props) {
    // mounted fix
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
    }, []);

    // states
    const [isShown, setIsShown] = useState<boolean>(false);
    const { setIsDisabled } = useDisabledScroll();

    // refs
    const elementRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    // dialog closing
    useEffect(() => {
        setIsDisabled(isShown);

        if (!modalRef.current) {
            return;
        }

        if (isShown) {
            modalRef.current.showModal();
            positionPopover(modalRef, elementRef, direction);
        } else {
            modalRef.current.close();
        }
    }, [isShown, setIsDisabled, direction]);

    // positioning
    useEffect(() => {
        const handle = () => {
            positionPopover(modalRef, elementRef, direction);
        };

        window.addEventListener("resize", handle);
        window.addEventListener("scroll", handle);

        return () => {
            window.removeEventListener("resize", handle);
            window.removeEventListener("scroll", handle);
        };
    }, [isShown, direction]);

    // click away
    useEffect(() => {
        if (!isShown) {
            return;
        }

        const handle = (e: PointerEvent) => {
            if (!modalRef.current) {
                return;
            }

            const { x, y } = { x: e.clientX, y: e.clientY };

            const bounds = modalRef.current.getBoundingClientRect();

            if (
                x > bounds.left &&
                x < bounds.right &&
                y > bounds.top &&
                y < bounds.bottom
            ) {
                return;
            }

            setIsShown(false);
        };

        window.addEventListener("pointerdown", handle);

        return () => {
            window.removeEventListener("pointerdown", handle);
        };
    }, [isShown]);

    const hide = useCallback(() => {
        setIsShown(false);
    }, []);

    return (
        mounted && (
            <>
                {/* trigger element */}
                <div
                    ref={elementRef}
                    onClick={() => setIsShown((prev) => !prev)}
                    inert={!isEnabled}
                    className={`w-fit h-fit ${!isEnabled ? "opacity-30" : ""} ${className ?? ""}`}
                >
                    {children}
                </div>

                {/* modal portal */}
                {createPortal(
                    <AnimatePresence>
                        {isShown && (
                            <dialog
                                onCancel={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsShown(false);
                                }}
                                onFocus={(e) => {
                                    e.stopPropagation();
                                }}
                                ref={modalRef}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                    }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                    }}
                                >
                                    {element?.(hide)}
                                </motion.div>
                            </dialog>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
            </>
        )
    );
});
