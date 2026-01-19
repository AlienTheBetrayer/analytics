import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    sizeLimit: number;
};

export const Error = ({ sizeLimit }: Props) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                width: 0,
                marginLeft: "0rem",
                scale: 0.7,
            }}
            animate={{
                opacity: 1,
                width: "auto",
                marginLeft: "0.3rem",
                scale: 1,
            }}
            exit={{
                opacity: 0,
                width: 0,
                marginLeft: "0rem",
                scale: 0.5,
            }}
            className="ml-2 overflow-hidden"
        >
            <span className="whitespace-nowrap">
                <u>
                    <small className="flex gap-1 items-center">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/fileerror.svg"
                        />
                        {`Max: ${sizeLimit} MB`}
                    </small>
                </u>
            </span>
        </motion.div>
    );
};
