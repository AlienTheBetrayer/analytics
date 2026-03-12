"use client";
import { Select } from "./Select";
import { Topline } from "./Topline";
import { NotificationRoute } from "../types/notifications";
import { LoadingNotifications } from "@/features/ui/loading/components/LoadingNotifications";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { useQuery } from "@/query/core";
import { Spinner } from "@/features/ui/spinner/components/Spinner";

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
                    <Spinner className="absolute left-1/2 top-1/2 -translate-1/2"/>
                </div>
            </>
        );
    }

    return (
        <>
            <Topline type={type} />

            <div className="box w-full max-w-400 mx-auto min-h-128 backdrop-blur-none! bg-background-1! p-1! sm:p-4!">
                <Select type={type} />
            </div>
        </>
    );
};
