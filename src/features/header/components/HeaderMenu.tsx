import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { useLocalStore } from "@/zustand/localStore";

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
                        <LinkButton href="/home" className="p-4! text-5!">
                            <Image
                                src="/cube.svg"
                                width={24}
                                height={24}
                                alt=""
                            />
                            Home
                        </LinkButton>
                    </li>
                    <li>
                        <LinkButton href="/dashboard" className="p-4! text-5!">
                            <Image
                                src="/dashboard.svg"
                                width={24}
                                height={24}
                                alt=""
                            />
                            Dashboard
                        </LinkButton>
                    </li>
                </div>

                <div className="flex flex-col gap-4">
                    {visibleProfile && (
                        <li>
                            <LinkButton
                                href="/profile"
                                className={`p-4! text-5! gap-2!`}
                            >
                                <ProfileImage
                                    profile={visibleProfile}
                                    width={16}
                                    height={16}
                                    className="w-8 aspect-square"
                                />
                                {visibleProfile.username ?? "Account"}
                            </LinkButton>
                        </li>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <li>
                        <Button className="p-4! text-5! w-full">
                            <Image
                                src="/cross.svg"
                                width={24}
                                height={24}
                                alt=""
                            />
                            Hide
                        </Button>
                    </li>
                </div>
            </ul>
        </motion.nav>
    );
};
