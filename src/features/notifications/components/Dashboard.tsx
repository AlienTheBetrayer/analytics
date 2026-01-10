import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Display } from "./Display";

export const Dashboard = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/book.svg"
                    className="invert-60!"
                />
                <span className="text-foreground-5!">Dashboard-only</span>
                <hr className="mb-4" />
            </div>

            <Display data={notifications.dashboard} />
        </div>
    );
};
