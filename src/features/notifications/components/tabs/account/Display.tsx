import { relativeTime } from "@/utils/other/relativeTime";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";
import { useAccountList } from "@/features/notifications/hooks/useAccountList";
import { NotificationCompact } from "../../parts/NotificationCompact";

export const Display = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const data = notifications.account;

    const { filtered } = useAccountList();

    if (!Object.keys(data).length) {
        return <AbsentNotifications />;
    }

    return (
        <ul className="flex flex-col gap-2">
            {filtered?.map((notification) => (
                <li key={notification.id}>
                    <NotificationCompact notification={notification}/>
                    <hr className='mt-4 mb-4'/>
                </li>
            ))}
        </ul>
    );
};
