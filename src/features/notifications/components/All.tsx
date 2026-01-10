import { useAppStore } from "@/zustand/store";
import { Display } from "./Display";
import Image from "next/image";

export const All = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);

    return (
        <div className="flex flex-col md:grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/account.svg"
                        className="invert-60!"
                    />
                    <span className="text-foreground-5!">Account-only</span>
                    <hr className="mb-4" />
                </div>

                <Display data={notifications.account} />
            </div>

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
        </div>
    );
};
