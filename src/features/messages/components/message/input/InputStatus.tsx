/** @format */

import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { useInputStatus } from "@/features/messages/components/message/input/useInputStatus";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export const InputStatus = (props: MessageInputProps) => {
    // styles
    const { determined } = useInputStatus(props.type);

    // jsx
    return (
        <div className="box p-0! flex-row! gap-0! self-stretch items-center justify-center aspect-square">
            <AnimatePresence mode="wait">
                <motion.div
                    className="flex items-center gap-0!"
                    key={props.type}
                    initial={{ x: 12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -12, opacity: 0 }}
                    transition={{
                        ease: [0.4, 0, 0.2, 1],
                        duration: 0.125,
                    }}
                >
                    <div
                        className="w-1 h-1 rounded-full"
                        style={{
                            background: determined.color,
                        }}
                    />

                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={determined.src}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
