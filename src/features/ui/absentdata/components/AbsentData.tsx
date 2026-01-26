import Image from "next/image";
import React from "react";

type Props = {
    title: React.ReactNode;
    description: React.ReactNode;
    children: React.ReactNode;
    src?: string;
    className?: string;
};

export const AbsentData = ({
    title,
    description,
    src = "/type.svg",
    className,
    children,
}: Props) => {
    return (
        <div
            className={`flex flex-col items-center justify-center mt-8 ${className ?? ""}`}
        >
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src={src}
                        />
                    </div>

                    <span className="text-5!">{title}</span>

                    <p className="max-w-100 text-center">{description}</p>
                </div>

                <hr />
                
                <div className="flex flex-col gap-2 items-center w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};
