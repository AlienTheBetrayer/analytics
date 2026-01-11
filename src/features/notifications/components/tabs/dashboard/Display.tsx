import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";
import { useDashboardList } from "@/features/notifications/hooks/useDashboardList";
import { NotificationCompact } from "../../parts/NotificationCompact";

export const Display = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const collapsedTabs = useLocalStore((state) => state.collapsedTabs);

    const data = notifications.dashboard;
    const { filtered } = useDashboardList();

    if (!Object.keys(data).length) {
        return <AbsentNotifications />;
    }

    return (
        <ul
            className="flex flex-col gap-2 transition-all duration-500 overflow-hidden"
            style={{
                height: collapsedTabs.dashboard ? "auto" : "0px",
                interpolateSize: "allow-keywords",
            }}
        >
            {filtered?.map((notification) => (
                <li key={notification.id}>
                    <NotificationCompact notification={notification} />
                    <hr className="my-4" />
                </li>
            ))}
        </ul>
    );
};
