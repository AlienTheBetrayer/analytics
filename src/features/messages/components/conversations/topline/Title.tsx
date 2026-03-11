/** @format */

import { SelectPart } from "@/features/messages/components/conversations/topline/SelectPart";
import { useTitle } from "@/features/messages/components/conversations/topline/useTitle";
import { motion } from "motion/react";
import Image from "next/image";

export const Title = () => {
    // ui
    const { color, image, text } = useTitle();

    // jsx
    return (
        <motion.span
            className="flex items-center gap-1 whitespace-nowrap"
            key={`${color}${image}${text}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div
                className="w-1 h-1 rounded-full"
                style={{
                    background: color ?? "var(--red-1)",
                }}
            />

            {image && (
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src={image}
                />
            )}

            <span>{text ?? "Unknown"}</span>
            <SelectPart />
        </motion.span>
    );
};
