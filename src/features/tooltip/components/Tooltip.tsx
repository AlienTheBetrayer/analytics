"use client";
import "./Tooltip.css";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
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

export const Tooltip = React.memo(function TooltipFunction({
    title,
    text,
    element,
    direction = "bottom",
    className = "",
    type = "tooltip",
    isEnabled = true,
    disabledPointer = true,
    children,
}: Props) {
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
                tooltipRef.current?.focus({ preventScroll: true });
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

        const handle = (e: PointerEvent | FocusEvent) => {
            const target = e.target as HTMLElement;

            if (!target) return;

            // 1. Ignore clicks inside the tooltip
            if (
                elementRef.current?.contains(target) ||
                tooltipRef.current?.contains(target) ||
                target.closest("[data-tooltip]")
            ) {
                return;
            }

            // 3. Clicked outside -> hide tooltip
            setIsShown(false);
        };

        window.addEventListener("pointerdown", handle);
        window.addEventListener("focusin", handle);
        return () => {
            window.removeEventListener("pointerdown", handle);
            window.removeEventListener("focusin", handle);
        };
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

    // focusing
    useEffect(() => {
        if (!isShown || !tooltipRef.current) {
            return;
        }

        const firstFocusable = tooltipRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        requestAnimationFrame(() => {
            if (!(firstFocusable && tooltipRef)) {
                return;
            }

            (firstFocusable ?? tooltipRef.current).focus({
                preventScroll: true,
            });
        });
    }, [isShown, type]);

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
                onClick={() => {
                    if (type === "modal") {
                        setIsShown((prev) => !prev);
                    }
                }}
                inert={!isEnabled}
                className={`w-fit h-fit ${className} ${isEnabled !== true ? "pointer-events-none" : ""}`}
            >
                {children}
            </div>

            {createPortal(
                <AnimatePresence>
                    {isShown && (
                        <motion.div
                            className="absolute hidden z-1000 p-1 border-0 outline-0"
                            tabIndex={type === "modal" ? -1 : undefined}
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
                                            <motion.span
                                                className="text-background-9!"
                                                key={title}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <b>{title}</b>
                                            </motion.span>
                                        )}
                                        {text && (
                                            <motion.span
                                                className="text-background-9!"
                                                key={text}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {text}
                                            </motion.span>
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
});
