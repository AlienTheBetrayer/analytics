import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { useLocalStore } from "@/zustand/localStore";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

type Props = {
    onInteract: () => void;
};

export const HeaderMenu = ({ onInteract }: Props) => {
    // ui states
    const visibleProfile = useLocalStore((state) => state.visibleProfile);

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: "all" }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
            className="fixed z-100 inset-0 bg-background-a-1 backdrop-blur-md md:hidden w-full h-full overflow-hidden"
            onClick={onInteract}
        >
            <ul className="w-full h-full flex flex-col justify-between p-8!">
                <div className="flex flex-col gap-4">
                    <li>
                        <LinkButton
                            href="/home"
                            className="p-4! text-5!"
                        >
                            <Image
                                src="/cube.svg"
                                width={16}
                                height={16}
                                alt=""
                                className="w-5 aspect-square"
                            />
                            Home
                        </LinkButton>
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
                            Dashboard
                        </LinkButton>
                    </li>
                </div>

                <div className="flex flex-col gap-4">
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
                                    className="w-5 aspect-square"
                                />
                                {visibleProfile.username ?? "Account"}
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
                                        Sign up
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
                                        Log in
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <li>
                        <Button className="p-4! text-5! w-full">
                            <Image
                                src="/cross.svg"
                                width={16}
                                height={16}
                                alt=""
                                className="w-5 aspect-square"
                            />
                            Hide
                        </Button>
                    </li>
                </div>
            </ul>
        </motion.nav>
    );
};
