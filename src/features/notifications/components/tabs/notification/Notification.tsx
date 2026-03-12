import { Topline } from "../../toplines/notification/Topline";
import { Display } from "./Display";
import { useParams } from "next/navigation";
import { useAppStore } from "@/zustand/store";

export const Notification = () => {
    // url
    const { id } = useParams<{ id?: string }>();

    // zustand
    const notifications = useAppStore((state) => state.notifications);

    // data propagated to components
    const data = id
        ? notifications.Account[id] || notifications.Dashboard[id]
        : undefined;

    return (
        <div className="box grow bg-bg-2! p-4! border-0!">
            <Topline data={data} />
            <Display data={data} />
        </div>
    );
};
