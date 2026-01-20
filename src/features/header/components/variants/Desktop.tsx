import { AuthButton } from "@/features/toolbox/components/AuthButton";
import { Theme } from "@/features/toolbox/components/Theme";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { SearchButton } from "../parts/SearchButton";
import { Button } from "@/features/ui/button/components/Button";
import { Socials } from "../parts/Socials";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useAppStore } from "@/zustand/store";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Desktop = ({ className }: Props) => {
    // zustand's localstore
    const visibleProfile = useLocalStore((state) => state.visibleProfile);
    const status = useAppStore((state) => state.status);

    return (
        <ul
            className={`grid grid-cols-[25%_1fr_25%] items-center w-full px-4! ${className ?? ""}`}
        >
            <li>
                <ul className="flex items-center">
                    <li className="flex group items-center">
                        <div className="w-1 aspect-square bg-blue-1 rounded-full group-hover:bg-red-1 duration-700 transition-all" />

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
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3! bg-background-6" />
                    </li>

                    {status && (
                        <li>
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
                        </li>
                    )}

                    {status && (
                        <li>
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
                        </li>
                    )}

                    {status && (
                        <li>
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
                        </li>
                    )}

                    <li>
                        <Modal element={(hide) => <Socials hide={hide}/>}>
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
                        </Modal>
                    </li>
                </ul>
            </li>

            <li className="justify-items-center">
                <SearchButton />
            </li>

            <li className="place-items-end">
                <ul className="flex gap-2 items-center">
                    <li>
                        <div
                            className={`rounded-full ${!visibleProfile ? "border-awaiting" : ""}`}
                        >
                            <AuthButton />
                        </div>
                    </li>

                    <li className="self-stretch flex items-center">
                        <hr className="w-px! h-1/3! bg-background-6" />
                    </li>

                    <li>
                        <Theme />
                    </li>
                </ul>
            </li>
        </ul>
    );
};
