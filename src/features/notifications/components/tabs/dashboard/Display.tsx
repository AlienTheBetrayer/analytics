import { relativeTime } from "@/utils/other/relativeTime";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";
import { useDashboardList } from "@/features/notifications/hooks/useDashboardList";

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
                    <LinkButton
                        className="box"
                        href={`/notification/${notification.id}`}
                    >
                        <span>{notification.id}</span>
                        <span>{notification.title}</span>
                        <span>{notification.description}</span>
                        <span>{notification.status}</span>
                        <span>{relativeTime(notification.sentAt)}</span>
                    </LinkButton>
                </li>
            ))}
        </ul>
    );
};
