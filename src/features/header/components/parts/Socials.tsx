import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const Socials = () => {
    return (
        <div className="box w-screen max-w-81">
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
        </div>
    );
};
