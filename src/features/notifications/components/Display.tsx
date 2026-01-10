import { relativeTime } from "@/utils/other/relativeTime";
import { DashboardNotification } from "@/types/zustand/dashboard";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentNotifications } from "./errors/AbsentNotifications";

type Props = {
    data: Record<string, DashboardNotification>;
};

export const Display = ({ data }: Props) => {
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
                            {relativeTime(notification.sentAt?.toISOString())}
                        </span>
                    </LinkButton>
                </li>
            ))}
        </ul>
    );
};
