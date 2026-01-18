"use client";
import "./Tooltip.css";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { TooltipDirection, TooltipType } from "../types/tooltip";
import { useTooltip } from "@/features/tooltip/hooks/useTooltip";

type Props = {
    title?: string;
    text?: string;
    element?: React.ReactNode;
    direction?: TooltipDirection;
    disabledPointer?: boolean;
    className?: string;
    isEnabled?: boolean;
    type?: TooltipType;
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
    const { mounted, isShown, setIsShown, tooltipRef, elementRef } = useTooltip(
        {
            direction,
            type,
        },
    );

    return (
        mounted && (
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
                                    if (
                                        !disabledPointer &&
                                        type === "tooltip"
                                    ) {
                                        setIsShown(true);
                                    }
                                }}
                                onPointerLeave={() => {
                                    if (
                                        !disabledPointer &&
                                        type === "tooltip"
                                    ) {
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
                                        scale:
                                            type === "tooltip" ? 0.75 : 0.975,
                                        pointerEvents: !disabledPointer
                                            ? "all"
                                            : "none",
                                    }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        pointerEvents: "none",
                                        scale:
                                            type === "tooltip" ? 0.75 : 0.975,
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
                    document.body,
                )}
            </>
        )
    );
});
