"use client";
import "./Header.css";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { Button } from "../../ui/button/components/Button";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { HeaderMenu } from "./HeaderMenu";
import { useAppStore } from "@/zustand/store";
import { createPortal } from "react-dom";
import { useHeader } from "../hooks/useHeader";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Toolbox } from "../../toolbox/components/Toolbox";

export const Header = () => {
    // zustand states
    const status = useAppStore((state) => state.status);

    // controller
    const { mounted, headerRef, isMenuOpen, showMenu, hideMenu } = useHeader();

    return (
        <header
            ref={headerRef}
            className="sticky mt-16 md:mt-8 mb-16 rounded-full backdrop-blur-md
        p-1 flex w-full max-w-400 mx-auto items-center justify-center  z-3
        duration-500 ease-in-out transition-all *:bg-background-a-2"
        >
            <nav className="flex items-center w-full md:w-fit mx-auto! rounded-full p-2">
                <ul className="flex justify-between gap-4 w-full h-full! *:flex *:items-center items-center px-4!">
                    <li>
                        <Tooltip text="Front page">
                            <LinkButton
                                href="/home"
                                styles="link"
                                className="button-img"
                            >
                                <Image
                                    src="/cube.svg"
                                    width={18}
                                    height={18}
                                    alt=""
                                    className={`group-hover:bg-invert-10`}
                                />
                                Home
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Display all profiles (WIP)">
                            <LinkButton href="/profiles">Users</LinkButton>
                        </Tooltip>
                    </li>

                    <li className="hidden! md:block!">
                        <Tooltip text="Analytics dashboard">
                            <LinkButton
                                href="/dashboard"
                                styles="link"
                                className="button-img"
                            >
                                <Image
                                    width={18}
                                    height={18}
                                    src="/launch.svg"
                                    alt=""
                                />
                                Dashboard
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li className="flex md:hidden">
                        <Button
                            styles="link"
                            className={`button-img ${!status ? "border-awaiting" : ""}`}
                            onClick={showMenu}
                        >
                            <Image
                                width={18}
                                height={18}
                                src="/menu.svg"
                                alt=""
                            />
                            Menu
                        </Button>
                    </li>
                </ul>
            </nav>

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isMenuOpen && <HeaderMenu onInteract={hideMenu} />}
                    </AnimatePresence>,
                    document.body
                )}

            <Toolbox />
        </header>
    );
};
