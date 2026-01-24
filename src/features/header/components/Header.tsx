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
                className="sticky my-8 rounded-full backdrop-blur-3xl
        p-1 flex w-full max-w-7xl mx-auto justify-center z-3
        duration-500 ease-in-out transition-all bg-background-a-3 min-h-16"
            >
                <nav className="flex items-center w-full! rounded-full outline-background-a-6 outline-1">
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
