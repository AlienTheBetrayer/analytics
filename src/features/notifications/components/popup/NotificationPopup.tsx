import { NotificationData } from "@/types/other/notifications";
import { Topline } from "./Topline";
import { motion } from "motion/react";

type Props = {
    notification: NotificationData;
    onInteract?: () => void;
};

export const NotificationPopup = ({ notification, onInteract }: Props) => {
    return (
        <motion.div
            className="flex flex-col gap-1 fixed! right-4 top-4 w-screen max-w-92 min-h-24 z-10 p-2! backdrop-blur-sm rounded-2xl"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
            }}
        >
            <Topline
                notification={notification}
                onInteract={onInteract}
            />

            <div className="box p-0! gap-0!">
                <div className="text-center grid justify-items-stretch *:w-full gap-2 p-3!">
                    <span className="text-5!">{notification.title}</span>
                    <span>{notification.description}</span>
                </div>
            </div>
        </motion.div>
    );
};
