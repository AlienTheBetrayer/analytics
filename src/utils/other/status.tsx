import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import type { PromiseStatus } from "@/hooks/usePromiseStatus";
import { motion } from "motion/react";

/**
 * checks the promise status for its completion / failure / pending and shows the corresponding JSX element
 * @param status status of the promise
 * @returns jsx element (spinner / cross image / checkmark image)
 */
export const promiseStatus = (status: PromiseStatus) => {
    const elem = () => {
        switch (status) {
            case "pending":
                return <Spinner />;
            case "rejected":
                return (
                    <Image
                        width={16}
                        height={16}
                        alt="error"
                        src="/cross.svg"
                    />
                );
            case "resolved":
                return (
                    <Image
                        width={12}
                        height={12}
                        alt="success"
                        src="/checkmark.svg"
                    />
                );
        }
    };

    return (
        <motion.div
            key={status}
            initial={{ opacity: 0, y: 5, scale: 0.1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
        >
            {elem()}
        </motion.div>
    );
};
