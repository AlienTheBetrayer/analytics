"use client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { PopoverDirection } from "@/features/ui/popovers/types/popover";
import { positionPopover } from "@/features/ui/popovers/utils/positionPopover";

type Props = {
    title?: string;
    text?: string;
    element?: React.ReactNode;
    direction?: PopoverDirection;
    pointerEvents?: boolean;
    className?: string;
    isEnabled?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
};

export const Tooltip = React.memo(function TooltipFunction({
    title,
    text,
    direction = "bottom",
    className = "",
    element,
    pointerEvents = false,
    isActive = true,
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

    // refs
    const elementRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    // dialog closing
    useEffect(() => {
        if (!tooltipRef.current) {
            return;
        }

        if (isShown) {
            tooltipRef.current.showPopover();
            positionPopover(tooltipRef, elementRef, direction);
        }
    }, [isShown, direction]);

    // positioning
    useEffect(() => {
        const handle = () => {
            positionPopover(tooltipRef, elementRef, direction);
        };
        handle();

        window.addEventListener("resize", handle);
        window.addEventListener("scroll", handle);

        return () => {
            window.removeEventListener("resize", handle);
            window.removeEventListener("scroll", handle);
        };
    }, [isShown, direction]);

    return (
        <>
            {/* trigger element */}
            <div
                ref={elementRef}
                onPointerEnter={() => {
                    if (!isActive) {
                        return;
                    }

                    setIsShown(true);
                }}
                onPointerLeave={() => setIsShown(false)}
                onFocus={() => {
                    if (!isActive) {
                        return;
                    }

                    setIsShown(true);
                }}
                onBlur={() => setIsShown(false)}
                inert={!isEnabled}
                className={`w-fit h-fit ${!isEnabled ? "opacity-30" : ""} ${className ?? ""}`}
            >
                {children}
            </div>

            {/* tooltip portal */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isShown && (
                            <div
                                popover="auto"
                                onPointerEnter={() => {
                                    if (pointerEvents) {
                                        setIsShown(true);
                                    }
                                }}
                                onPointerLeave={() => {
                                    if (pointerEvents) {
                                        setIsShown(false);
                                    }
                                }}
                                onToggle={(e) => {
                                    e.stopPropagation();
                                    if (e.newState === "closed") {
                                        setIsShown(false);
                                    }
                                }}
                                ref={tooltipRef}
                                className="bg-transparent overflow-hidden whitespace-nowrap p-1 z-1000"
                                style={{
                                    pointerEvents: pointerEvents
                                        ? "all"
                                        : "none",
                                }}
                            >
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    transition={{
                                        ease: [0.4, 0, 0.2, 1],
                                        duration: 0.3,
                                    }}
                                    className={`backdrop-blur-md rounded-4xl ${element ? "" : "box py-1.5! px-3! rounded-full!"}`}
                                >
                                    {element ?? (
                                        <small className="flex flex-col items-center">
                                            {title && <span>{title}</span>}
                                            {text && (
                                                <span>
                                                    <small>{text}</small>
                                                </span>
                                            )}
                                        </small>
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
});
