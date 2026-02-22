import { EditingTopline } from "@/features/messages/components/message/editing/EditingTopline";
import { motion } from "motion/react";

export const EditingMenu = () => {
    return (
        <motion.div
            className="absolute inset-0 bg-bg-2 rounded-4xl"
            initial={{ x: "100%" }}
            animate={{ x: "0" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0 }}
        >
            <EditingTopline />
        </motion.div>
    );
};
