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
            className="flex flex-col gap-0 fixed! right-4 top-4 w-[70vw] max-w-96 min-h-24 z-10 p-2!"
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

            <div className="box p-0! gap-0! acrylic rounded-2xl!">
                <div className="text-center grid justify-items-stretch *:w-full gap-2 p-4!">
                    <span className="text-5!">{notification.title}</span>
                    <span>{notification.description}</span>
                </div>
            </div>
        </motion.div>
    );
};
