"use client";
import "./AuthButton.css";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Button } from "@/features/ui/button/components/Button";
import { AuthElements } from "./AuthElements";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import Image from "next/image";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import { usePathname } from "next/navigation";

export const AuthButton = () => {
    // url
    const page = usePathname().split("/")[1];

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    if (!status) {
        return (
            <nav className="flex items-center justify-center">
                <Tooltip text="Sign up / Log in">
                    <Modal
                        direction="bottom-left"
                        element={(hide) => <AuthElements hide={hide} />}
                    >
                        <Button className="p-0!">
                            <div className="loading w-10 rounded-full! aspect-square" />
                        </Button>
                    </Modal>
                </Tooltip>
            </nav>
        );
    }

    return (
        <nav className="flex items-center justify-center p-1 logged-in-nav">
            <Tooltip
                text="Sign up / Log in"
                className="auth-button-tooltip p-0.5!"
            >
                <Modal
                    direction="bottom-left"
                    element={(hide) => <AuthElements hide={hide} />}
                >
                    <Button className="p-0!">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/auth.svg"
                        />
                        <TabSelection
                            condition={page === "login" || page === "signup"}
                        />
                    </Button>
                </Modal>
            </Tooltip>

            <Tooltip
                text="Go to your profile"
                direction="bottom"
            >
                <LinkButton
                    href="/profile"
                    className="p-0!"
                >
                    <ProfileImage
                        profile={status.profile}
                        width={256}
                        height={256}
                        className="w-8! h-8! aspect-square"
                    />
                </LinkButton>
            </Tooltip>
        </nav>
    );
};
