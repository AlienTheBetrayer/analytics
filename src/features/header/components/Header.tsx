"use client";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { Button } from "../../ui/button/components/Button";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { HeaderMenu } from "./HeaderMenu";
import { AuthenticationToolbox } from "@/features/authentication/components/AuthenticationToolbox";
import { useAppStore } from "@/zustand/store";
import { createPortal } from "react-dom";
import { useHeader } from "../hooks/useHeader";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

export const Header = () => {
    // zustand states
    const status = useAppStore((state) => state.status);

    // controller
    const { mounted, headerRef, isMenuOpen, showMenu, hideMenu } = useHeader();

    return (
        <header
            ref={headerRef}
            className="sticky mt-16 sm:mt-8 mb-16 rounded-full backdrop-blur-md 
        p-1 flex w-full max-w-400 mx-auto items-center! z-3
        duration-500 ease-in-out transition-all *:bg-background-a-2 *:border-2 *:border-background-3"
        >
            <nav className="flex absolute left-1/2 -translate-1/2 top-1/2 items-center w-full sm:w-fit mx-auto  backdrop-blur-2xl rounded-full p-2">
                <ul className="flex justify-between gap-4 w-full h-full! *:flex *:items-center items-center px-4!">
                    <li>
                        <Tooltip text="Front page">
                            <LinkButton
                                href="/home"
                                styles="link"
                            >
                                <Image
                                    src="/cube.svg"
                                    width={18}
                                    height={18}
                                    alt=""
                                    className="group-hover:invert-100!"
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

                    <li className="hidden! sm:block!">
                        <Tooltip text="Analytics dashboard">
                            <LinkButton
                                href="/dashboard"
                                styles="link"
                            >
                                <Image
                                    width={18}
                                    height={18}
                                    src="/launch.svg"
                                    alt=""
                                    className="group-hover:invert-100!"
                                />
                                Dashboard
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li className="flex sm:hidden">
                        <Button
                            styles="link"
                            className={`${!status ? "border-awaiting" : ""}`}
                            onClick={showMenu}
                        >
                            <Image
                                width={18}
                                height={18}
                                src="/menu.svg"
                                alt=""
                                className="group-hover:invert-100!"
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

            <AuthenticationToolbox />
        </header>
    );
};
