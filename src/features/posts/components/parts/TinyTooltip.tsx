import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    data: string | number | undefined;
    src: string;
    size?: number;
    showData?: boolean;
    tooltip: string;
};

export const TinyTooltip = ({ data, showData, size, src, tooltip }: Props) => {
    return (
        !!data && (
            <motion.li
                initial={{ y: 5 }}
                animate={{ y: 0 }}
                exit={{ y: 5 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="min-w-6 h-6 opacity-60! flex items-center justify-center rounded-full backdrop-blur-xs"
                key={data}
            >
                <Tooltip text={tooltip}>
                    <div
                        className="flex items-center gap-1 p-1!"
                        key={data}
                    >
                        {showData && (
                            <span>
                                <em>{data}</em>
                            </span>
                        )}
                        <em>
                            <Image
                                alt=""
                                width={size ?? 12}
                                height={size ?? 12}
                                src={src}
                            />
                        </em>
                    </div>
                </Tooltip>
            </motion.li>
        )
    );
};
