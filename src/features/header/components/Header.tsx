"use client";
import "./Header.css";
import { AnimatePresence } from "motion/react";
import { useHeader } from "../hooks/useHeader";
import { Menu } from "./variants/Menu";
import { Desktop } from "./variants/Desktop";
import { Mobile } from "./variants/Mobile";

export const Header = () => {
    // controller
    const { headerRef, isMenuOpen, showMenu, hideMenu } = useHeader();

    return (
        <>
            <header
                ref={headerRef}
                className="sticky mb-8 mt-4 rounded-full backdrop-blur-sm
        p-1 flex w-full max-w-5xl mx-auto items-center justify-center z-3
        duration-500 ease-in-out transition-all bg-background-a-3 min-h-16"
            >
                <nav className="flex items-center w-full! h-full! rounded-full outline-background-a-6 outline-1">
                    <Desktop className="hidden md:grid" />
                    <Mobile
                        className="grid md:hidden"
                        showMenu={showMenu}
                    />
                </nav>
            </header>

            <AnimatePresence>
                {isMenuOpen && <Menu hideMenu={hideMenu} />}
            </AnimatePresence>
        </>
    );
};
