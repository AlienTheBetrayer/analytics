import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";
import { useDashboardList } from "@/features/notifications/hooks/useDashboardList";
import { NotificationCompact } from "../../parts/NotificationCompact";

export const Display = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const data = notifications.dashboard;

    const { filtered } = useDashboardList();

    if (!Object.keys(data).length) {
        return <AbsentNotifications />;
    }

    return (
        <ul className="flex flex-col gap-2">
            {filtered?.map((notification) => (
                <li key={notification.id}>
                    <NotificationCompact notification={notification} />
                    <hr className="mt-4 mb-4" />
                </li>
            ))}
        </ul>
    );
};
