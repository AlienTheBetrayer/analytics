/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";
import "./Tooltip.css";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TooltipDirection } from "../types/Tooltip";
import { positionTooltip } from "../utils/positionTooltip";

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
                !(e.target instanceof Node) ||
                !isShown ||
                !hasPositioned.current
            ) {
                return;
            }

            const contains =
                tooltipRef.current.contains(e.target) || elementRef.current.contains(e.target);

            if (!contains) {
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
                    if (!disabledPointer && type === "tooltip") {
                        setIsShown(true);
                    }
                }}
                onKeyDown={(e) => {
                    if (!disabledPointer && e.key === "Escape" && type === "tooltip") {
                        setIsShown(false);
                    }

                    if (!disabledPointer && e.key === "Enter" && type === "modal") {
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
                            className="absolute hidden z-9999 p-1"
                            ref={tooltipRef}
                            initial={{ pointerEvents: !disabledPointer ? "all" : "none" }}
                            exit={{ pointerEvents: "none" }}
                            onBlur={(e) => {
                                if (
                                    !disabledPointer &&
                                    !tooltipRef.current?.contains(e.target) &&
                                    !elementRef.current?.contains(e.target)
                                ) {
                                    setIsShown(false);
                                }
                            }}
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
                                    pointerEvents: !disabledPointer ? "all" : "none",
                                }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, pointerEvents: "none" }}
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
                                        {text && <span className="text-background-9!">{text}</span>}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </>
    );
};
