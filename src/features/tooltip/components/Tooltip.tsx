"use client";
import "./Tooltip.css";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { positionTooltip } from "../utils/positionTooltip";
import { TooltipDirection } from "../types/tooltip";

type Props = {
    title?: string;
    text?: string;
    element?: React.ReactNode;
    direction?: TooltipDirection;
    disabledPointer?: boolean;
    className?: string;
    isEnabled?: boolean;
    type?: "tooltip" | "modal";
    children: React.ReactNode;
};

export const Tooltip = ({
    title,
    text,
    element,
    direction = "bottom",
    className = "",
    type = "tooltip",
    isEnabled = true,
    disabledPointer = true,
    children,
}: Props) => {
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
    const hasPositioned = useRef<boolean>(false);

    useEffect(() => {
        if (isShown) {
            return;
        }

        hasPositioned.current = false;
    }, [isShown]);

    // positioning the tooltip
    useEffect(() => {
        if (!isShown) {
            return;
        }

        const handle = () => {
            if (!elementRef.current || !tooltipRef.current) {
                return;
            }

            positionTooltip(tooltipRef, elementRef, direction);
            requestAnimationFrame(() => {
                hasPositioned.current = true;
            });
            setTimeout(() => {
                positionTooltip(tooltipRef, elementRef, direction);
            }, 0);
        };
        handle();

        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, [isShown, direction]);

    // click away functionality
    useEffect(() => {
        if (!isShown) {
            return;
        }

        const handle = (e: PointerEvent) => {
            if (
                !tooltipRef.current ||
                !elementRef.current ||
                !isShown ||
                !hasPositioned.current
            ) {
                return;
            }

            const x = e.clientX;
            const y = e.clientY;

            const tooltipBounds = tooltipRef.current.getBoundingClientRect();
            const tooltipContains =
                x > tooltipBounds.left &&
                x < tooltipBounds.right &&
                y > tooltipBounds.top &&
                y < tooltipBounds.bottom;

            const elementBounds = elementRef.current.getBoundingClientRect();
            const elementContains =
                x > elementBounds.left &&
                x < elementBounds.right &&
                y > elementBounds.top &&
                y < elementBounds.bottom;

            if (!tooltipContains && !elementContains) {
                setIsShown(false);
            }
        };

        window.addEventListener("pointerdown", handle);
        return () => window.removeEventListener("pointerdown", handle);
    }, [isShown]);

    // hotkeys
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape":
                    setIsShown(false);
                    break;
            }
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div
                ref={elementRef}
                onPointerEnter={() => {
                    if (type === "tooltip") {
                        setIsShown(true);
                    }
                }}
                onPointerLeave={() => {
                    if (type === "tooltip") {
                        setIsShown(false);
                    }
                }}
                onFocus={() => {
                    if (type === "tooltip") {
                        setIsShown(true);
                    }
                }}
                onBlur={(e) => {
                    if (!tooltipRef.current?.contains(e.relatedTarget)) {
                        setIsShown(false);
                    }
                }}
                onKeyDown={(e) => {
                    if (
                        !disabledPointer &&
                        e.key === "Escape" &&
                        type === "tooltip"
                    ) {
                        setIsShown(false);
                    }

                    if (
                        !disabledPointer &&
                        e.key === "Enter" &&
                        type === "modal"
                    ) {
                        setIsShown(true);
                    }
                }}
                onPointerDown={() => {
                    if (type === "modal") {
                        setIsShown((prev) => !prev);
                    }
                }}
                className={`w-fit h-fit ${className} ${isEnabled !== true ? "pointer-events-none" : ""}`}
            >
                {children}
            </div>

            {createPortal(
                <AnimatePresence>
                    {isShown && (
                        <motion.div
                            className="absolute hidden z-1000 p-1"
                            ref={tooltipRef}
                            initial={{
                                pointerEvents: !disabledPointer
                                    ? "all"
                                    : "none",
                            }}
                            exit={{ pointerEvents: "none" }}
                            onPointerEnter={() => {
                                if (!disabledPointer && type === "tooltip") {
                                    setIsShown(true);
                                }
                            }}
                            onPointerLeave={() => {
                                if (!disabledPointer && type === "tooltip") {
                                    setIsShown(false);
                                }
                            }}
                        >
                            <motion.div
                                className={`${!element ? "tooltip" : ""}
                                whitespace-nowrap border-0 outline-0
                            `}
                                initial={{
                                    opacity: 0,
                                    scale: type === "tooltip" ? 0.75 : 0.975,
                                    pointerEvents: !disabledPointer
                                        ? "all"
                                        : "none",
                                }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    pointerEvents: "none",
                                    scale: type === "tooltip" ? 0.75 : 0.975,
                                }}
                            >
                                {element ? (
                                    element
                                ) : (
                                    <div className="flex flex-col items-center">
                                        {title && (
                                            <span className="text-background-9!">
                                                <b>{title}</b>
                                            </span>
                                        )}
                                        {text && (
                                            <span className="text-background-9!">
                                                {text}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
