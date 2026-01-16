"use client";
import { useAppStore } from "@/zustand/store";
import { Select } from "./Select";
import { Topline } from "./Topline";
import { NotificationRoute } from "../types/notifications";
import { LoadingNotifications } from "@/features/loading/components/LoadingNotifications";

type Props = {
    type: NotificationRoute;
};

export const Notifications = ({ type }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    if (!status) {
        return (
            <div className="box w-full max-w-400 mx-auto min-h-128">
                <LoadingNotifications />
            </div>
        );
    }

    return (
        <>
            <Topline type={type} />
            
            <div className="box w-full max-w-400 mx-auto min-h-128 backdrop-blur-none! bg-background-1!">
                <Select type={type} />
            </div>
        </>
    );
};
