import Image from "next/image";
import { Topline } from "../../toplines/Topline";
import { useAppStore } from "@/zustand/store";
import { TabDisplay } from "../TabDisplay";

export const Dashboard = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications).Dashboard;

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
                    <small>({Object.keys(notifications)?.length ?? 0})</small>
                </span>
            </div>

            <hr />
            <Topline tab="Dashboard" />

            <hr />
            <TabDisplay tab="Dashboard" />
        </div>
    );
};
