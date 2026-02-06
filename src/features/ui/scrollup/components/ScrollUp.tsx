"use client";
import { Button } from "@/features/ui/button/components/Button";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ScrollUp = () => {
    // states
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const handle = (value: number) => {
            setVisible(value > 0.7);
        };

        const unsub = scrollYProgress.on("change", handle);
        return () => unsub();
    }, [scrollYProgress]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.aside
                    className="box p-1! fixed! bottom-2 right-2 z-2"
                    initial={{
                        opacity: 0,
                        y: 32,
                        scale: 0,
                        filter: `blur(0.5rem)`,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: `blur(0rem)`,
                    }}
                    exit={{
                        opacity: 0,
                        y: 32,
                        scale: 0,
                        filter: `blur(0.5rem)`,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                >
                    <Button
                        className="p-3!"
                        onClick={() => {
                            window.scrollTo({ behavior: "smooth", top: 0 });
                        }}
                    >
                        <Image
                            alt="up"
                            width={16}
                            height={16}
                            src="/arrow.svg"
                        />
                    </Button>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};
