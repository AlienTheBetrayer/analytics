"use client";
import "./Header.css";
import { AnimatePresence, motion } from "motion/react";
import { useHeader } from "../hooks/useHeader";
import { Menu } from "./variants/Menu";
import { Desktop } from "./variants/Desktop";
import { Mobile } from "./variants/Mobile";
import { useSessionStore } from "@/zustand/sessionStore";
import { useEffect } from "react";

export const Header = () => {
    // session storage
    const animations = useSessionStore((state) => state.animations);
    const updateAnimations = useSessionStore((state) => state.updateAnimations);

    useEffect(() => {
        if (animations.header) {
            return;
        }

        updateAnimations({ header: true });
    }, [animations, updateAnimations]);

    // controller
    const { headerRef, isMenuOpen, showMenu, hideMenu } = useHeader();

    return (
        <>
            <header
                ref={headerRef}
                className="sticky my-8 top-2  rounded-full backdrop-blur-3xl
        flex w-full max-w-400 mx-auto z-3
        duration-500 ease-in-out transition-all justify-center bg-background-a-3 min-h-16"
            >
                <motion.nav
                    className="flex items-center w-full rounded-full outline-background-a-6 outline-1"
                    initial={
                        !animations.header
                            ? {
                                  opacity: 0,
                                  y: -32,
                                  filter: `blur(1rem)`,
                              }
                            : {}
                    }
                    animate={{ y: 0, opacity: 1, filter: `blur(0)` }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        delay: 1,
                    }}
                >
                    <Desktop className="hidden md:grid" />
                    <Mobile
                        className="grid md:hidden"
                        showMenu={showMenu}
                    />
                </motion.nav>
            </header>

            <AnimatePresence>
                {isMenuOpen && <Menu hideMenu={hideMenu} />}
            </AnimatePresence>
        </>
    );
};
