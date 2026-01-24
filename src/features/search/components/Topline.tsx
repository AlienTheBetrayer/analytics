import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const Topline = () => {
    return (
        <ul
            className={`box p-0! gap-1! my-2! sticky! top-4 z-2 mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt="Search"
                        src="/pencil.svg"
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Go back home">
                    <LinkButton
                        href="/home/"
                        className="p-0! md:px-2!"
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/cube.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3! bg-background-6" />
            </li>
        </ul>
    );
};
