import Image from "next/image";
import React from "react";

type Props = {
    src: string;
    text: string;
    children?: React.ReactNode;
    className?: string;
};

export const BentoSection = ({ src, text, children, className }: Props) => {
    return (
        <section className="flex flex-col gap-4 items-center w-full p-2!">
            <span className="flex flex-col items-center">
                <Image
                    alt=""
                    width={24}
                    height={24}
                    src={src}
                />
                <span>{text}</span>
            </span>

            {children && <div className={`flex flex-col gap-2 w-full h-full ${className ?? ""}`}>{children}</div>}
        </section>
    );
};
