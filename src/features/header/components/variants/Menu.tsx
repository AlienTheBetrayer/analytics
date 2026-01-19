import "./Menu.css";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { useLocalStore } from "@/zustand/localStore";
import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Theme } from "@/features/toolbox/components/Theme";
import { Socials } from "../parts/Socials";

type Props = {
    hideMenu: () => void;
};

export const Menu = ({ hideMenu }: Props) => {
    // ui states
    const visibleProfile = useLocalStore((state) => state.visibleProfile);

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: "all" }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
            className="fixed z-100 inset-0 bg-background-a-1 backdrop-blur-md md:hidden w-full h-full overflow-hidden"
            onClick={hideMenu}
        >
            <ul className="w-full h-full flex flex-col justify-between p-8! header-ul">
                <li>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <LinkButton
                                href="/home"
                                className="p-4! text-5!"
                            >
                                <div className="w-1 aspect-square bg-blue-1 rounded-full group-hover:bg-red-1 duration-700 transition-all" />
                                <Image
                                    src="/cube.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                    className="w-5 aspect-square"
                                />
                                <span>Home</span>
                            </LinkButton>
                        </li>

                        <li>
                            <hr />
                        </li>

                        <li>
                            <LinkButton
                                href="/dashboard"
                                className="p-4! text-5!"
                            >
                                <Image
                                    src="/dashboard.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                    className="w-5 aspect-square"
                                />
                                <span>Dashboard</span>
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton
                                href="/notifications"
                                className="p-4! text-5!"
                            >
                                <Image
                                    src="/notification.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                    className="w-5 aspect-square"
                                />
                                <span>Notifications</span>
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton
                                href="/contact"
                                className="p-4! text-5!"
                            >
                                <Image
                                    src="/phone.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                    className="w-5 aspect-square"
                                />
                                <span>Contact</span>
                            </LinkButton>
                        </li>

                        <li>
                            <hr />
                        </li>

                        <li>
                            <Socials className="flex-row! max-w-full! *:w-full p-0! bg-transparent! border-0! outline-0!" />
                        </li>
                    </ul>
                </li>

                <li>
                    <ul className="flex flex-col gap-2">
                        {visibleProfile ? (
                            <li>
                                <LinkButton
                                    href="/profile"
                                    className={`p-4! text-5! gap-2!`}
                                >
                                    <ProfileImage
                                        profile={visibleProfile}
                                        width={16}
                                        height={16}
                                        className="w-6 aspect-square"
                                    />
                                    <span>
                                        {visibleProfile.username ?? "Account"}
                                    </span>
                                </LinkButton>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Tooltip
                                        text="Create an account"
                                        className="w-full"
                                    >
                                        <LinkButton
                                            href="/signup"
                                            className="p-4! text-5!"
                                        >
                                            <Image
                                                width={16}
                                                height={16}
                                                alt=""
                                                src="/pencil.svg"
                                                className="w-5 aspect-square"
                                            />
                                            <span>Sign up</span>
                                        </LinkButton>
                                    </Tooltip>
                                </li>

                                <li>
                                    <Tooltip
                                        text="Log in an existing account"
                                        className="w-full"
                                    >
                                        <LinkButton
                                            href="/login"
                                            className="p-4! text-5!"
                                        >
                                            <Image
                                                width={16}
                                                height={16}
                                                alt=""
                                                src="/security.svg"
                                                className="w-5 aspect-square"
                                            />
                                            <span>Log in</span>
                                        </LinkButton>
                                    </Tooltip>
                                </li>
                            </>
                        )}

                        <li>
                            <Theme className="p-4! gap-1!">
                                <span>Theme</span>
                            </Theme>
                        </li>

                        <li>
                            <hr />
                        </li>

                        <li>
                            <Button className="p-4! text-5! w-full">
                                <Image
                                    src="/cross.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                    className="w-5 aspect-square"
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
