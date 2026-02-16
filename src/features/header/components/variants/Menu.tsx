import "./Menu.css";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Theme } from "@/features/header/components/toolbox/components/Theme";
import { useQuery } from "@/query/core";
import { usePathname } from "next/navigation";
import { TabSelection } from "@/utils/other/TabSelection";

type Props = {
    hideMenu: () => void;
};

export const Menu = ({ hideMenu }: Props) => {
    // url
    const [, page, secondary] = usePathname().split("/");

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: "all" }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
            className="fixed z-100 inset-0 bg-background-a-1 backdrop-blur-md md:hidden w-full h-full overflow-hidden"
            onClick={hideMenu}
        >
            <ul className="acrylic w-full h-full flex flex-col justify-between p-4! header-ul">
                <li>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <LinkButton href="/home">
                                <div className="w-1 aspect-square bg-blue-1 rounded-full group-hover:bg-red-1 duration-700 transition-all" />
                                <Image
                                    src="/cube.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                <span>Home</span>
                                <TabSelection
                                    className="right-4! top-2!"
                                    condition={!page || page === "home"}
                                />
                            </LinkButton>
                        </li>

                        {status && (
                            <>
                                <li>
                                    <LinkButton href="/dashboard">
                                        <Image
                                            src="/dashboard.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Dashboard</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={page === "dashboard"}
                                        />
                                    </LinkButton>
                                </li>

                                <li>
                                    <LinkButton href="/notifications">
                                        <Image
                                            src="/notification.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Notifications</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={
                                                page === "notifications" ||
                                                page === "notification"
                                            }
                                        />
                                    </LinkButton>
                                </li>

                                <li>
                                    <LinkButton href="/contact">
                                        <Image
                                            src="/phone.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Contact</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={page === "contact"}
                                        />
                                    </LinkButton>
                                </li>

                                <li className="grid grid-cols-2 gap-2">
                                    <LinkButton href="/messages">
                                        <Image
                                            src="/send.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Messages</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={page === "messages"}
                                        />
                                    </LinkButton>

                                    <LinkButton href="/messages/notes/board">
                                        <Image
                                            src="/pencil.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Notes</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={
                                                page === "messages" &&
                                                secondary === "notes"
                                            }
                                        />
                                    </LinkButton>
                                </li>

                                <li>
                                    <LinkButton href="/posts">
                                        <Image
                                            src="/select.svg"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span>Posts</span>
                                        <TabSelection
                                            className="right-4! top-2!"
                                            condition={
                                                page === "post" ||
                                                page === "posts"
                                            }
                                        />
                                    </LinkButton>
                                </li>
                            </>
                        )}
                    </ul>
                </li>

                <li>
                    <ul className="flex flex-col gap-2">
                        {status ? (
                            <li>
                                <LinkButton
                                    href="/profile"
                                    className="gap-2!"
                                >
                                    <ProfileImage
                                        profile={status.profile}
                                        width={16}
                                        height={16}
                                        className="w-6"
                                    />
                                    <span>{status.username ?? "Account"}</span>
                                    <TabSelection
                                        className="right-4! top-2!"
                                        condition={page === "profile"}
                                    />
                                </LinkButton>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Tooltip
                                        text="Create an account"
                                        className="w-full"
                                    >
                                        <LinkButton href="/signup">
                                            <Image
                                                width={16}
                                                height={16}
                                                alt=""
                                                src="/pencil.svg"
                                            />
                                            <span>Sign up</span>
                                            <TabSelection
                                                className="right-4! top-2!"
                                                condition={page === "signup"}
                                            />
                                        </LinkButton>
                                    </Tooltip>
                                </li>

                                <li>
                                    <Tooltip
                                        text="Log in an existing account"
                                        className="w-full"
                                    >
                                        <LinkButton href="/login">
                                            <Image
                                                width={16}
                                                height={16}
                                                alt=""
                                                src="/security.svg"
                                            />
                                            <span>Log in</span>
                                            <TabSelection
                                                className="right-4! top-2!"
                                                condition={page === "login"}
                                            />
                                        </LinkButton>
                                    </Tooltip>
                                </li>
                            </>
                        )}

                        <li>
                            <Theme className="gap-1!">
                                <span>Theme</span>
                            </Theme>
                        </li>

                        <li>
                            <Button className="w-full">
                                <Image
                                    src="/cross.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                <span>Hide</span>
                            </Button>
                        </li>
                    </ul>
                </li>
            </ul>
        </motion.nav>
    );
};
