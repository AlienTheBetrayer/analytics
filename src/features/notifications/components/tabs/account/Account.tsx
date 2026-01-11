import { Display } from "./Display";
import { Topline } from "../../toplines/account/Topline";
import Image from "next/image";
import { useLocalStore } from "@/zustand/localStore";

export const Account = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center relative w-full justify-center gap-1">
                <Image
                    alt="account-only"
                    width={16}
                    height={16}
                    src="/account.svg"
                />
                <span>Account</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2">
                    <small>
                        ({Object.keys(notifications.account)?.length ?? 0})
                    </small>
                </span>
            </div>

            <hr />
            <Topline />

            <hr />
            <Display />
        </div>
    );
};
