import { Topline } from "../../toplines/notification/Topline";
import { Display } from "./Display";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";

export const Notification = () => {
    // url
    const { id } = useParams<{ id?: string }>();

    // zustand
    const notifications = useAppStore((state) => state.notifications);

    // fallback
    const data = id
        ? notifications.account[id] || notifications.dashboard[id]
        : undefined;

    return (
        <div className="flex flex-col gap-2">
            <Topline data={data} />
            <hr />
            <Display data={data} />
        </div>
    );
};
