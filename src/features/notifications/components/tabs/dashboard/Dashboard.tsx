import { Display } from "./Display";
import { Topline } from "../../toplines/dashboard/Topline";
import Image from "next/image";
import { useLocalStore } from "@/zustand/localStore";

export const Dashboard = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center relative w-full gap-1">
                <Image
                    alt="dashboard-only"
                    width={16}
                    height={16}
                    src="/dashboard.svg"
                />
                <span>Dashboard</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2">
                    <small>
                        ({Object.keys(notifications.dashboard)?.length ?? 0})
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
