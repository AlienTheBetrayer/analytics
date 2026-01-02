"use client";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDisabledScroll } from "@/hooks/useDisabledScroll";
import { Button } from "../../ui/button/components/Button";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { HeaderMenu } from "./HeaderMenu";
import { AuthenticationToolbox } from "@/features/authentication/components/AuthenticationToolbox";
import { useAppStore } from "@/zustand/store";

export const Header = () => {
    // zustand states
    const status = useAppStore((state) => state.status);

    // react states
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // disabling scroll
    const disabledScroll = useDisabledScroll();

    useEffect(() => {
        disabledScroll.setIsDisabled(isMenuOpen);
    }, [isMenuOpen, disabledScroll]);

    return (
        <header className="sticky my-8 top-8 flex w-full items-center! h-12 z-3 duration-500 transition-all *:bg-background-a-2 *:border-2 *:border-background-3">
            <nav className="flex absolute left-1/2 -translate-1/2 top-1/2 items-center w-full sm:w-fit h-full mx-auto  backdrop-blur-3xl rounded-full p-2">
                <ul className="flex justify-between gap-4 w-full *:flex *:items-center items-center px-4!">
                    <li>
                        <LinkButton href="/home" styles="link">
                            <Image
                                src="/cube.svg"
                                width={18}
                                height={18}
                                alt=""
                                className="group-hover:invert-100!"
                            />
                            Home
                        </LinkButton>
                    </li>

                    <li>
                        <LinkButton href="/profiles">Users</LinkButton>
                    </li>

                    <li className="hidden! sm:block!">
                        <LinkButton href="/dashboard" styles="link">
                            <Image
                                width={18}
                                height={18}
                                src="/launch.svg"
                                alt=""
                                className="group-hover:invert-100!"
                            />
                            Dashboard
                        </LinkButton>
                    </li>

                    <li className="flex sm:hidden">
                        <Button
                            styles="link"
                            className={`${!status ? "border-awaiting" : ""}`}
                            onClick={() => {
                                setIsMenuOpen(true);
                            }}
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

            <AnimatePresence>
                {isMenuOpen && (
                    <HeaderMenu
                        onInteract={() => {
                            setIsMenuOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <AuthenticationToolbox />
        </header>
    );
};
