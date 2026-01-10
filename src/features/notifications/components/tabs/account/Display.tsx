import { relativeTime } from "@/utils/other/relativeTime";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";

export const Display = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const data = notifications.account;

    if (!Object.keys(data).length) {
        return <AbsentNotifications />;
    }

    return (
        <ul className="flex flex-col gap-2">
            {Object.values(data).map((notification) => (
                <li key={notification.id}>
                    <LinkButton
                        className="box"
                        href={`/notification/${notification.id}`}
                    >
                        <span>{notification.id}</span>
                        <span>
                            {relativeTime(notification.sentAt)}
                        </span>
                    </LinkButton>
                </li>
            ))}
        </ul>
    );
};
