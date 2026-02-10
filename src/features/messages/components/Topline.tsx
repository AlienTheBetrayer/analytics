import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const Topline = () => {
    return (
        <ul className="box my-4! items-center! p-0! h-10! flex-row! w-full max-w-400 mx-auto!">
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/send.svg"
                />
            </li>

            <li>
                <LinkButton href="/home">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cube.svg"
                    />
                </LinkButton>
            </li>
        </ul>
    );
};
