"use client";
import { Select } from "./Select";
import { Topline } from "./Topline";
import { NotificationRoute } from "../types/notifications";
import { LoadingNotifications } from "@/features/ui/loading/components/LoadingNotifications";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { useQuery } from "@/query/core";

type Props = {
    type: NotificationRoute;
};

export const Notifications = ({ type }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // fallbacks
    if (!status) {
        return (
            <>
                <AbsentTopline title="Not authenticated" />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <LoadingNotifications />
                </div>
            </>
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
