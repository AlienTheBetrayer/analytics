import { Spinner } from "@/features/spinner/components/Spinner";
import { PromiseStatusType } from "@/hooks/usePromiseStatus";
import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    status: PromiseStatusType;
};

export const PromiseStatus = ({ status }: Props) => {
    const elem = (() => {
        switch (status) {
            case "pending": {
                return <Spinner />;
            }
            case "rejected": {
                return (
                    <Image
                        width={16}
                        height={16}
                        alt="error"
                        src="/cross.svg"
                    />
                );
            }
            case "resolved": {
                return (
                    <Image
                        width={12}
                        height={12}
                        alt="success"
                        src="/checkmark.svg"
                    />
                );
            }
            default: {
                return null;
            }
        }
    })();

    return (
        elem && (
            <motion.div
                key={status}
                initial={{ opacity: 0, y: 5, scale: 0.1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
            >
                {elem}
            </motion.div>
        )
    );
};
