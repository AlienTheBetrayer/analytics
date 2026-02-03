import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type Props = {
    hide?: () => void;
} & ComponentPropsWithoutRef<"div">;

export const Socials = ({ hide, className }: Props) => {
    return (
        <ul className={`relative box w-screen max-w-81 ${className ?? ""}`}>
            {hide && <CloseButton hide={hide} />}

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
    );
};
