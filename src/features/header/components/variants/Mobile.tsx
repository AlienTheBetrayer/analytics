import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { SearchButton } from "../parts/SearchButton";

type Props = {
    showMenu: () => void;
} & ComponentPropsWithoutRef<"div">;

export const Mobile = ({ className, showMenu }: Props) => {
    // zustand states
    const status = useAppStore((state) => state.status);

    return (
        <ul
            className={`grid grid-cols-[15%_1fr_15%] items-center w-full px-4! ${className ?? ""}`}
        >
            <li className='flex items-center group'>
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

            <li className="justify-items-center">
                <SearchButton />
            </li>

            <li className="flex items-center justify-end">
                <Button
                    styles="link"
                    className={`button-img ${!status ? "border-awaiting" : ""} p-2`}
                    onClick={showMenu}
                >
                    <Image
                        width={18}
                        height={18}
                        src="/menu.svg"
                        alt="menu"
                    />
                </Button>
            </li>
        </ul>
    );
};
