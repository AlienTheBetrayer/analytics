import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Socials = ({ className }: Props) => {
    return (
        <ul
            className={`relative box w-screen max-w-64 p-4! acrylic gap-4! ${className ?? ""}`}
        >
            <li className="flex items-center self-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/social.svg"
                />
                <span>Socials:</span>
            </li>

            <li>
                <hr />
            </li>

            <ul className="flex flex-col gap-2">
                <li>
                    <LinkButton
                        href="https://github.com/AlienTheBetrayer"
                        newTab={true}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/github.svg"
                        />
                        GitHub
                    </LinkButton>
                </li>

                <li>
                    <LinkButton
                        href="https://www.linkedin.com/in/gleb-pichkurov-14662a385/"
                        newTab={true}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/linkedin.svg"
                        />
                        LinkedIn
                    </LinkButton>
                </li>
            </ul>
        </ul>
    );
};
