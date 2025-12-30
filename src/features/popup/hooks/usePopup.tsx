"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type BlurConfig = {
    isEnabled?: boolean;
    className?: string;
};

export const usePopup = (
    component: (controls: { hide: () => void }) => React.ReactNode,
    onClose?: () => void,
    blurConfig?: BlurConfig,
) => {
    // states
    const [isShown, setIsShown] = useState<boolean>(false);

    // hotkeys
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape":
                    setIsShown(false);
                    onClose?.();
                    break;
            }
        };
        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, [onClose]);

    const show = useCallback(() => {
        setIsShown(true);
    }, []);

    const hide = useCallback(() => {
        setIsShown(false);
    }, []);

    // user functions
    const render = useCallback(() => {
        return createPortal(
            <>
                <AnimatePresence>{isShown && component({ hide })}</AnimatePresence>
                {(blurConfig?.isEnabled ?? true) && (
                    <AnimatePresence>
                        {isShown && (
                            <motion.div
                                className={`fixed inset-0 z-32 ${blurConfig?.className ?? "backdrop-blur-xs bg-[#00000030]"}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => {
                                    setIsShown(false);
                                    onClose?.();
                                }}
                            />
                        )}
                    </AnimatePresence>
                )}
            </>,
            document.body,
        );
    }, [isShown, component, blurConfig, onClose, hide]);

    return {
        isShown,
        show,
        hide,
        render,
    };
};
