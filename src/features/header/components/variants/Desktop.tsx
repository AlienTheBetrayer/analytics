import { AuthButton } from "@/features/header/components/toolbox/components/AuthButton";
import { Theme } from "@/features/header/components/toolbox/components/Theme";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { SearchButton } from "../parts/SearchButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import { usePathname } from "next/navigation";
import { TabSelection } from "@/utils/other/TabSelection";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Desktop = ({ className }: Props) => {
    // url
    const [, page, secondary] = usePathname().split("/");

    // local storage
    const theme = useLocalStore((state) => state.theme);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <ul
            className={`grid grid-cols-[1fr_1fr_1fr] items-center w-full px-4! ${className ?? ""}`}
        >
            <li className="min-w-max">
                <ul className="flex items-center gap-1">
                    <li className="flex group items-center">
                        <div className="w-1 aspect-square bg-blue-1 rounded-full group-hover:bg-red-1 duration-700 transition-all" />

                        <Tooltip text="Home">
                            <LinkButton
                                href="/home"
                                styles="link"
                                className="button-img"
                            >
                                <Image
                                    src="/cube.svg"
                                    width={18}
                                    height={18}
                                    alt="home"
                                />
                                <TabSelection
                                    condition={!page || page === "home"}
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-5/12!" />
                    </li>

                    <li>
                        <ul
                            className={`flex items-center ${!status ? "opacity-30" : ""} transition-all duration-500`}
                            inert={!!!status}
                        >
                            <li>
                                <Tooltip text="Dashboard">
                                    <LinkButton
                                        href="/dashboard"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/dashboard.svg"
                                            alt="dashboard"
                                        />
                                        <TabSelection
                                            condition={page === "dashboard"}
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Notifications">
                                    <LinkButton
                                        href="/notifications"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/notification.svg"
                                            alt="notification"
                                        />
                                        <TabSelection
                                            condition={
                                                page === "notifications" ||
                                                page === "notification"
                                            }
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Contact">
                                    <LinkButton
                                        href="/contact"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={16}
                                            height={16}
                                            src="/phone.svg"
                                            alt="contact"
                                        />
                                        <TabSelection
                                            condition={page === "contact"}
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Profile">
                                    <LinkButton
                                        href="/profile"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={14}
                                            height={14}
                                            src="/account.svg"
                                            alt="posts"
                                        />
                                        <TabSelection
                                            condition={
                                                page === "posts" ||
                                                page === "post"
                                            }
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Posts">
                                    <LinkButton
                                        href="/posts"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={14}
                                            height={14}
                                            src="/select.svg"
                                            alt="posts"
                                        />
                                        <TabSelection
                                            condition={
                                                page === "posts" ||
                                                page === "post"
                                            }
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Messages">
                                    <LinkButton
                                        href="/messages"
                                        styles="link"
                                        className="button-img"
                                    >
                                        <Image
                                            width={18}
                                            height={18}
                                            src="/send.svg"
                                            alt="msg"
                                        />
                                        <TabSelection
                                            condition={page === "messages"}
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <LinkButton
                                    href="/messages/notes/board"
                                    styles="link"
                                    className="button-img"
                                >
                                    <Image
                                        src="/pencil.svg"
                                        width={16}
                                        height={16}
                                        alt=""
                                    />
                                    <TabSelection
                                        condition={
                                            page === "messages" &&
                                            secondary === "notes"
                                        }
                                    />
                                </LinkButton>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>

            <li className="justify-items-center">
                <SearchButton />
            </li>

            <li className="flex items-center justify-end">
                <ul className="flex gap-1 items-center">
                    <li>
                        <div
                            className={`relative rounded-full ${!status ? "border-awaiting" : ""}`}
                        >
                            <AuthButton />
                            <TabSelection condition={page === "profile"} />
                        </div>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3!" />
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
