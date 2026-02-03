import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { promiseListeners } from "@/promises/data/init";
import { PromiseKey, PromiseStatus } from "@/promises/types";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    state: PromiseKey;
};

export const PromiseState = ({ state }: Props) => {
    // states
    const [status, setStatus] = useState<PromiseStatus>("idle");

    // listeners
    useEffect(() => {
        const handle = (state: PromiseStatus) => {
            setStatus(state);
        };

        promiseListeners.attach({ key: state, fn: handle });
        return () => promiseListeners.detach({ key: state, fn: handle });
    }, [state]);

    // clearing status
    useEffect(() => {
        if (!(status === "rejected" || status === "resolved")) {
            return;
        }

        const timeout = setTimeout(() => setStatus("idle"), 5000);
        return () => clearTimeout(timeout);
    }, [status]);

    return (
        <AnimatePresence>
            {status !== "idle" && (
                <motion.div
                    initial={{
                        width: "0rem",
                        opacity: 0,
                    }}
                    animate={{
                        width: "1rem",
                        opacity: 1,
                    }}
                    exit={{
                        width: "0rem",
                        opacity: 0,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <motion.div
                        key={status}
                        initial={{ y: 5, scale: 0.5 }}
                        animate={{ y: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        {(() => {
                            switch (status) {
                                case "pending": {
                                    return <Spinner />;
                                }
                                case "resolved": {
                                    return (
                                        <Image
                                            alt=""
                                            width={12}
                                            height={12}
                                            src="/checkmark.svg"
                                        />
                                    );
                                }
                                case "rejected": {
                                    return (
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/cross.svg"
                                        />
                                    );
                                }
                            }
                        })()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
