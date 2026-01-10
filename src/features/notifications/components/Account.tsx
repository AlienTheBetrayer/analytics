import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Display } from "./Display";

export const Account = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/account.svg"
                    className="invert-60!"
                />
                <span className="text-foreground-5!">Account-only</span>
                <hr className="mt-4" />
            </div>

            <Display data={notifications.account}/>
        </div>
    );
};
