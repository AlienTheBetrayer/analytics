import { NotificationData } from "@/types/other/notifications";
import { Topline } from "./Topline";
import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    notification: NotificationData;
    onInteract?: () => void;
};

export const NotificationPopup = ({ notification, onInteract }: Props) => {
    return (
        <motion.div
            className="flex flex-col gap-0 fixed! right-4 top-4 w-[70vw] max-w-72 z-10 p-0! acrylic rounded-4xl!"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
            }}
        >
            <div className="box p-0! gap-0! acrylic rounded-4xl!">
                <Topline
                    notification={notification}
                    onInteract={onInteract}
                />

                <div className="flex flex-col text-center items-center justify-center gap-2 px-4! py-4!">
                    <div className="flex flex-col items-center gap-0">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/type.svg"
                        />
                        <span className="flex items-center gap-1 text-5!">
                            <div className="w-1 h-1 rounded-full bg-bg-8" />
                            {notification.title}
                        </span>
                    </div>

                    <span className="flex items-center gap-1 text-bg-7!">{notification.description}</span>
                </div>
            </div>
        </motion.div>
    );
};
