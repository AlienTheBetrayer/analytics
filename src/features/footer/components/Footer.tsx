"use client";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="box p-0! px-4! h-10 w-full max-w-400 z-3 mx-auto! mt-8! mb-6! rounded-full!">
            <ul className="flex gap-2 h-full">
                <li className="flex items-center shrink-0">
                    <Tooltip
                        direction="top"
                        element={
                            <div className="box p-2! rounded-full!">
                                <div className="w-1 h-1 bg-blue-1 rounded-full" />
                            </div>
                        }
                    >
                        <LinkButton
                            href="/home"
                            styles="link"
                            className="button-img p-2"
                        >
                            <div className="w-1 h-1 rounded-full bg-blue-1 transition-all! duration-500!" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/server.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>

                <li className="flex items-center">
                    <hr className="w-px! h-1/3!" />
                </li>

                <li className="flex items-center truncate">
                    <span className="flex items-center gap-1">
                        — an evolving system
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/trend.svg"
                        />
                    </span>
                </li>

                <li className="flex items-center ml-auto!">
                    <LinkButton
                        className="button-img link p-2"
                        styles="link"
                        href="https://www.linkedin.com/in/gleb-pichkurov-14662a385/"
                        newTab
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/linkedin.svg"
                        />
                    </LinkButton>
                </li>

                <li className="flex items-center">
                    <LinkButton
                        className="button-img link p-2"
                        styles="link"
                        href="https://github.com/AlienTheBetrayer"
                        newTab
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/github.svg"
                        />
                    </LinkButton>
                </li>
            </ul>
        </footer>
    );
};
