"use client";
import { useAppStore } from "@/zustand/store";
import { Select } from "./Select";
import { Topline } from "./Topline";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { NotificationRoute } from "../types/notifications";

type Props = {
    type: NotificationRoute;
};

export const Notifications = ({ type }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    if (!status) {
        return (
            <div className="box w-full max-w-400 mx-auto min-h-128">
                <AuthRequired />
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
