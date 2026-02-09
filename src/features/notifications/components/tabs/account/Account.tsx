import { Topline } from "../../toplines/Topline";
import Image from "next/image";
import { useAppStore } from "@/zustand/store";
import { TabDisplay } from "../TabDisplay";

export const Account = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications).Account;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center relative w-full justify-center gap-1">
                <Image
                    alt="account-only"
                    width={16}
                    height={16}
                    src="/account.svg"
                />
                <span>Account</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2">
                    <small>({Object.keys(notifications)?.length ?? 0})</small>
                </span>
            </div>

            <Topline tab="Account" />

            <hr />
            <TabDisplay tab="Account" />
        </div>
    );
};
