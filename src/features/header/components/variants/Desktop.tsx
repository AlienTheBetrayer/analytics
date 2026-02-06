import { AuthButton } from "@/features/header/components/toolbox/components/AuthButton";
import { Theme } from "@/features/header/components/toolbox/components/Theme";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { SearchButton } from "../parts/SearchButton";
import { Button } from "@/features/ui/button/components/Button";
import { Socials } from "../parts/Socials";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Desktop = ({ className }: Props) => {
    // local storage
    const theme = useLocalStore((state) => state.theme);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <ul
            className={`grid grid-cols-[30%_1fr_30%] items-center w-full px-4! ${className ?? ""}`}
        >
            <li>
                <ul className="flex items-center">
                    <li className="flex group items-center">
                        <div className="w-1 aspect-square bg-blue-1 rounded-full group-hover:bg-red-1 duration-700 transition-all" />

                        <Tooltip text="Home">
                            <LinkButton
                                href="/home"
                                styles="link"
                                className="button-img p-2"
                            >
                                <Image
                                    src="/cube.svg"
                                    width={18}
                                    height={18}
                                    alt="home"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3! bg-background-6" />
                    </li>

                    <li>
                        <ul
                            className={`flex items-center ${!status ? "opacity-30" : ""} transition-all duration-500`}
                            inert={!!!status}
                        >
                            <li>
                                <Tooltip text="Posts">
                                    <LinkButton
                                        href="/posts"
                                        styles="link"
                                        className="button-img p-2"
                                    >
                                        <Image
                                            width={14}
                                            height={14}
                                            src="/select.svg"
                                            alt="posts"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Dashboard">
                                    <LinkButton
                                        href="/dashboard"
                                        styles="link"
                                        className="button-img p-2"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/dashboard.svg"
                                            alt="dashboard"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Notifications">
                                    <LinkButton
                                        href="/notifications"
                                        styles="link"
                                        className="button-img p-2"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/notification.svg"
                                            alt="notification"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Contact">
                                    <LinkButton
                                        href="/contact"
                                        styles="link"
                                        className="button-img p-2"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/phone.svg"
                                            alt="contact"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        </ul>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3! bg-background-6" />
                    </li>

                    <li>
                        <Modal element={(hide) => <Socials hide={hide} />}>
                            <Tooltip text="Socials">
                                <Button
                                    styles="link"
                                    className="button-img p-2"
                                >
                                    <Image
                                        width={18}
                                        height={18}
                                        src="/social.svg"
                                        alt="contact"
                                    />
                                </Button>
                            </Tooltip>
                        </Modal>
                    </li>
                </ul>
            </li>

            <li className="justify-items-center">
                <SearchButton />
            </li>

            <li className="flex items-center justify-end">
                <ul className="flex gap-2 items-center">
                    <li>
                        <div
                            className={`rounded-full ${!status ? "border-awaiting" : ""}`}
                        >
                            <AuthButton />
                        </div>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3! bg-background-6" />
                    </li>

                    <li>
                        <Tooltip
                            text={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                        >
                            <Theme />
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
