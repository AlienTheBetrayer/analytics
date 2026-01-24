import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    title: string;
    color?: string;
    className?: string;
};

export const AbsentTopline = ({ title, color, className }: Props) => {
    return (
        <ul
            className={`box loading p-0! sticky! z-2! top-8! rounded-full! px-1! gap-1! my-2! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center ${className ?? ""}`}
        >
            <li>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                >
                    <li>
                        <Tooltip text="Home">
                            <LinkButton href="/home">
                                <Image
                                    src="/cube.svg"
                                    alt="home"
                                    width={16}
                                    height={16}
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li className="absolute left-1/2 top-1/2 -translate-1/2 flex gap-1 items-center">
                        <div
                            className="w-1 h-1 rounded-full"
                            style={{ background: color ?? "var(--red-1)" }}
                        />
                        <span>{title}</span>
                    </li>
                </motion.ul>
            </li>
        </ul>
    );
};
