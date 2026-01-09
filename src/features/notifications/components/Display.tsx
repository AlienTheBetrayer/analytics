import { relativeTime } from "@/utils/other/relativeTime";
import { DashboardNotification } from "@/types/zustand/dashboard";

type Props = {
    data: Record<string, DashboardNotification>;
};

export const Display = ({ data }: Props) => {
    return (
        <ul className="flex flex-col gap-2">
            {Object.values(data).map((notification) => (
                <li
                    key={notification.id}
                    className="box"
                >
                    <span>{notification.id}</span>
                    <span>
                        {relativeTime(notification.sentAt?.toISOString())}
                    </span>
                </li>
            ))}
        </ul>
    );
};
